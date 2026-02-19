import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { authHelpers, dbHelpers } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const adminStatusCacheRef = useRef(new Map()) // Cache admin status per user ID
  const isCheckingAdminRef = useRef(false) // Prevent concurrent checks

  // Check auth state on mount and listen for changes
  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""
    
    if (!supabaseUrl || !supabaseAnonKey) {
      // Supabase not configured, skip auth and allow app to render
      setLoading(false)
      return
    }

    // Get initial session
    authHelpers.getSession()
      .then(({ session, error }) => {
        // Only set user if we have a valid session and no error
        if (session?.user && !error) {
          setUser(session.user)
          // Check admin status - will use cache if available
          checkAdminStatus(session.user.id).catch(err => {
            console.error("Error checking admin status:", err)
          })
        } else {
          // No valid session, ensure user is null
          setUser(null)
          setIsAdmin(false)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error getting session:", error)
        // On error, ensure we're signed out
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
      })

    // Listen for auth changes
    try {
      const { data: { subscription } } = authHelpers.onAuthStateChange(
        async (event, session) => {
          // Handle SIGNED_OUT event explicitly to prevent re-authentication
          if (event === 'SIGNED_OUT') {
            setUser(null)
            setIsAdmin(false)
            adminStatusCacheRef.current.clear()
            setLoading(false)
            return
          }
          
          // Only set user if we have a valid session
          if (session?.user) {
            setUser(session.user)
            try {
              // Check admin status - will use cache if available
              await checkAdminStatus(session.user.id)
            } catch (err) {
              console.error("Error checking admin status:", err)
            }
          } else {
            setUser(null)
            setIsAdmin(false)
            // Clear cache when user logs out
            adminStatusCacheRef.current.clear()
          }
          setLoading(false)
        }
      )

      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    } catch (error) {
      console.error("Error setting up auth listener:", error)
      setLoading(false)
    }
  }, [])

  const checkAdminStatus = async (userId, retryCount = 0) => {
    // Prevent concurrent checks for the same user
    if (isCheckingAdminRef.current && retryCount === 0) {
      return
    }

    // If we have a cached value for this user, use it immediately
    if (adminStatusCacheRef.current.has(userId) && retryCount === 0) {
      const cachedStatus = adminStatusCacheRef.current.get(userId)
      setIsAdmin(cachedStatus)
      return
    }

    try {
      isCheckingAdminRef.current = true
      const { isAdmin: adminStatus, error } = await dbHelpers.isAdmin(userId)
      
      if (error) {
        console.error("Error checking admin status:", error)
        // Retry up to 2 times before giving up
        if (retryCount < 2) {
          setTimeout(() => {
            checkAdminStatus(userId, retryCount + 1).catch(console.error)
          }, 500 * (retryCount + 1)) // Exponential backoff
          return
        }
        // After retries, only set to false if we have no cached value
        // This prevents flickering if we had a previous successful check
        if (!adminStatusCacheRef.current.has(userId)) {
          setIsAdmin(false)
        }
        return
      }
      
      // Cache the result - only update if we got a successful response
      const finalStatus = adminStatus || false
      adminStatusCacheRef.current.set(userId, finalStatus)
      setIsAdmin(finalStatus)
    } catch (error) {
      console.error("Error checking admin status:", error)
      // Retry up to 2 times before giving up
      if (retryCount < 2) {
        setTimeout(() => {
          checkAdminStatus(userId, retryCount + 1).catch(console.error)
        }, 500 * (retryCount + 1))
        return
      }
      // After retries, only set to false if we have no cached value
      if (!adminStatusCacheRef.current.has(userId)) {
        setIsAdmin(false)
      }
    } finally {
      isCheckingAdminRef.current = false
    }
  }

  const signUp = async (email, password, fullName = '') => {
    setLoading(true)
    try {
      const { data, error } = await authHelpers.signUp(email, password, {
        full_name: fullName,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      const { data, error } = await authHelpers.signIn(email, password)
      if (error) throw error
      
      // Check admin status asynchronously (don't block sign-in)
      if (data?.user) {
        // Don't await - let it run in background
        checkAdminStatus(data.user.id).catch(err => {
          console.error("Error checking admin status during sign-in:", err)
        })
      }
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      // Always reset loading state
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      // Clear local state first
      setUser(null)
      setIsAdmin(false)
      // Clear admin status cache
      adminStatusCacheRef.current.clear()
      
      // Then sign out from Supabase (this also clears storage)
      const { error } = await authHelpers.signOut()
      
      // Wait a bit to ensure sign out completes
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (error) {
        console.error("Supabase sign out error:", error)
        // Still clear state and storage even if Supabase sign out fails
        try {
          // Force clear all auth storage
          Object.keys(localStorage).forEach(key => {
            if (key.includes('supabase') || key.includes('sb-')) {
              localStorage.removeItem(key)
            }
          })
          Object.keys(sessionStorage).forEach(key => {
            if (key.includes('supabase') || key.includes('sb-')) {
              sessionStorage.removeItem(key)
            }
          })
        } catch (storageError) {
        }
        return { error: null }
      }
      return { error: null }
    } catch (error) {
      console.error("Sign out exception:", error)
      // Clear state even if there's an error
      setUser(null)
      setIsAdmin(false)
      // Force clear storage
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            localStorage.removeItem(key)
          }
        })
        Object.keys(sessionStorage).forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            sessionStorage.removeItem(key)
          }
        })
      } catch (storageError) {
      }
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signInWithOAuth = async (provider) => {
    setLoading(true)
    try {
      const { data, error } = await authHelpers.signInWithOAuth(provider)
      if (error) {
        // Check if provider is not enabled
        if (error.message?.includes("not enabled") || error.message?.includes("Unsupported provider")) {
          throw new Error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not enabled. Please contact support or use email/password login.`)
        }
        throw error
      }
      // OAuth redirects, so we don't need to wait for completion
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      // Don't reset loading immediately for OAuth as it redirects
      setTimeout(() => setLoading(false), 1000)
    }
  }

  const value = {
    user,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

