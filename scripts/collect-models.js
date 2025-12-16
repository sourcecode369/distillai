// collector.js - ES Module version with README + metadata enrichment
// Run with: node collector.js --tier1

import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import fs from 'fs';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HF_API_KEY = process.env.HF_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Publisher Images - Maps organization names to their logo/avatar URLs
const PUBLISHER_IMAGES = {
  '1X': 'https://www.gravatar.com/avatar/77313bd6020f4e34277e2ad0a4de4b1c?d=retro&size=100',
  '42-Labs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/637c8a7e6bb832c586c09f26/NuB3kEa6m0tCeJ8VGpTWg.png',
  'AGI-Inc': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6824e7f1bae28c3bce75164b/VyP6z_QE_2g2DYzoJhjEd.png',
  'AI-Singapore': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1660886913493-62ff1d57419904a14287ef84.png',
  'AI-Squared,-Inc.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/642db81699f3110ac27d5d70/SHYcx92hcAPv-L28VimH0.png',
  'facebook': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1592839207516-noauth.png',
  'AI71': 'https://cdn-avatars.huggingface.co/v1/production/uploads/638eb5f949de7ae552dd6211/32SVxB9AmUhYaIqLsOD9A.png',
  'AIDC-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/666a9d46a638e57bb7907929/CRc-9MCuH2q9hjTScyTPE.png',
  'AIM-Intelligence': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6237dfd72d85ea7b3051d5bb/4ziksWDvCH9aF1hnr5SW8.png',
  'AIdeaLab': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1676912769264-60348737e8149a962412a68a.jpeg',
  'AMD': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65ff7616871b36bf84150cda/mBg2Z4Vcdt5bkjxbYJFej.png',
  'AUGMXNT': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63a7422854f1d0225b075bfc/P5Yw3fUTQ54oaSofdSNl8.png',
  'Acellera': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64599a0aa82daa98729dc902/1ZnsvZ9kVbfvv2nDyk5oO.jpeg',
  'Acuvity-Inc': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65e913532dcdb39d193c8e6e/2T6aj_4bdLldJegbCix22.png',
  'Adalat-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66af56272f4c59963af728f7/lFB9hf1fkqBebur8CMZvu.jpeg',
  'AgentSea': 'https://cdn-avatars.huggingface.co/v1/production/uploads/667c74127f75474515edd6e7/SniXUKEirt6UnUBR1p6rm.png',
  'Agentica': 'https://cdn-avatars.huggingface.co/v1/production/uploads/652867b09903f7a1c9f7cbf1/s5AyAWwXFutyA_GY0Ct1e.jpeg',
  'Ai2': 'https://cdn-avatars.huggingface.co/v1/production/uploads/652db071b62cf1f8463221e2/CxxwFiaomTa1MCX_B7-pT.png',
  'Aleph-Alpha-Research': 'https://cdn-avatars.huggingface.co/v1/production/uploads/631ad613c9f8cd19a73b625c/n0wQnzIidssA_-1Z9ZXGZ.png',
  'Algorithmic-Research-Group': 'https://cdn-avatars.huggingface.co/v1/production/uploads/630a2b5ae81e1dea2cebd148/8Z8MiIT5Tj_z46gf_TVLI.png',
  'Allegro-Lab-@-USC': 'https://cdn-avatars.huggingface.co/v1/production/uploads/681b9614996d48481b110c96/FaxZFWZYhtl26XhoE2gI5.png',
  'Alpha-Singularity': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67f8c8fb66dda43bf2752583/Z8jBpjFWqKepFRXQpUNeu.png',
  'Amazon': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66f19ed428ae41c20c470792/8y7msN6A6W82LdQhQd85a.png',
  'Amini': 'https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/k59iw3-8-1Jm2jh8oDyCy.png',
  'AngelSlim': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6594d0c6c5f1cd69a48b261d/04ZNQlAfs08Bfg4B1o3XO.png',
  'Apple': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1653390727490-5dd96eb166059660ed1ee413.jpeg',
  'Arc-Intelligence': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6532cecc7139c5dd8d527685/zSBXFkPILDrjSwIVu2U7V.png',
  'ArcInstitute': 'https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/q4euiTLwyYKJFJeK2hC7A.png',
  'Arcee-Training-Org': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64a4440384f31593d4b5fdfa/drGOQY_r5CI8GfcUfjob7.png',
  'ArceeAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6435718aaaef013d1aec3b8b/GZPnGkfMn8Ino6JbkL4fJ.png',
  'Argmax': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64c612d618bc1b4e81023e7b/Ga9AJAiQrVDBGlmt9lMmO.png',
  'Arm': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6682a9252200824e2ddc667f/3iiNWniZEWibAFfFruTjC.png',
  'AskUI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65ccb11c21d66b975e017778/kCo90DgT94jX4VNJNSE_F.png',
  'Athena-Research-Center-|-Institute-for-Language-and-Speech-Processing': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61c17fa04fcde74777ea5862/L5ALOJk9kadk2xR3y1Jt2.png',
  'Atomic-Canyon': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6387b53f1901766b88046b6f/EM0aybDBnU6mJBR-AN1cV.png',
  'Aumo-S/A': 'https://cdn-avatars.huggingface.co/v1/production/uploads/659b5e92c1144540fdf7353e/ANZ-bhvgPLvQ474tuiH60.png',
  'Axolotl-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/641dfddf3bae5a77636817c5/Wa6Qn38GOAlhl6ClMv_Q3.png',
  'Axur': 'https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/xB8YHJ0iMVqLMgo-V8hh-.png',
  'BRIAAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65659985cfbe8a857070d950/1HTn-HmGDwK53SSJ5dEYt.png',
  'BRICKS': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63f71a29df66696652ec93c1/4nk6KIYQBewanEdLbr8nd.png',
  'Baidu': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64f187a2cc1c03340ac30498/TYYUxK8xD1AxExFMWqbZD.png',
  'Bespoke-Labs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/655e1c11accde1bbc8c4034b/gan0PsimqPMgUjtXQByoi.png',
  'BigCode': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1659521200179-5e48005437cb5b49818287a5.png',
  'BioAge-Labs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67b7026ba7567156c65ec186/41-_2iinG0d2axHMV09WO.jpeg',
  'Black-Forest-Labs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/633f7a8f4be90e06da248e0f/m5YoF33abJ09vcwFxt1Mj.png',
  'Black-Hills-Information-Security': 'https://cdn-avatars.huggingface.co/v1/production/uploads/675cade55382ed3e731f8e27/YBudOALexmB-Guuhu08ab.png',
  'BoldVoice': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65557913f96492362e29c704/hkcVVRcXMtGY3jO8nQFRr.png',
  'Bylaw': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1657008183845-6213b56bb633fd62c87254fe.png',
  'Bynesoft-Ltd.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/639622ba5510375ff2b39d92/8uH0uBrFGHuQ7Ua6x9Qvt.png',
  'ByteDance-Seed': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6535c9e88bde2fae19b6fb25/flkDUqd_YEuFsjeNET3r-.png',
  'ByteShape': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6036780adcb315f9ae9f7d26/9MfH5UbC9Hl_4J8d2DN6E.png',
  'CAMeL-Lab': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1614259764881-6037a5628740ddf98c16fea4.jpeg',
  'CGIAR': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61ac8f8a00d01045fca0ad2f/cJlmKnT6jZVyqP7Z2vvCv.png',
  'CTW': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66c6d8312402eab42a303cb5/MdRp7Svl36rflgNK7IbX4.png',
  'Call-Center-Studio': 'https://cdn-avatars.huggingface.co/v1/production/uploads/644a60334a37e7c384b75dec/73NFkt-lAmMJpEtrvVm7H.png',
  'Cantina,-Inc.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63038f694ec2dfa82a53d7ea/f8DrIasGFbqyF5o4MbX_M.png',
  'Chai-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6155957c9fd38df575eccbcb/232JHE_5FImktgdOBJsMO.jpeg',
  'Chan-Zuckerberg-Initiative': 'https://cdn-avatars.huggingface.co/v1/production/uploads/653ae566251b430ac065fb07/osNsZ-NyfDnTP1lK9v5Nw.png',
  'Charles-Elena': 'https://www.gravatar.com/avatar/f0ee84e63f1f6292ea90963919a8ce53?d=retro&size=100',
  'Chutes': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6453dafca647b92069ac541a/p2oM5opq5VzCpU3SBB2ao.png',
  'Cirrascale-Cloud-Services': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67f4874ca5ea8948d6127edf/8kviz45oSW6tPabZKgvU1.png',
  'Clarifai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1620749879479-605ba1962bd7bebcc260c2a9.png',
  'CohereLabs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1678549441248-5e70f6048ce3c604d78fe133.png',
  'Collinear-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/62424000cce0bae7eb45487b/lP5HJtUZRnuiUXaqFdJoB.png',
  'Commotion': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65798835c063b04fdc0d7b87/fnWsjHAV00HI9oC6Y9NUL.png',
  'ConfidentialMind': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65884cdbd2ea3f32942fe22b/IyOl0mgKmM1kg2S7j4ybx.png',
  'Consensus': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1648676429196-6244cd1ae2fe03790c7f52a6.jpeg',
  'Corto': 'https://www.gravatar.com/avatar/5208f74272f9abce14ac985974823387?d=retro&size=100',
  'Cosmonauts-&-Kings': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6454ed27e4952d1c6cb3bca7/pUfxhzpEcpb5VWNAw9N5a.jpeg',
  'Cribl,-Inc.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67a3ee47a5df3348419006a6/lCqu8EjQQETgsec6NElCn.png',
  'Crusoe-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6627e1ab16064a919b370864/OttXIDUgprV3k6OIibZFO.png',
  'DATUMO': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63aa4990769a10efc403771c/-hPclrsYl0IW6kqD2DWBL.png',
  'DICTA:-The-Israel-Center-for-Text-Analysis': 'https://cdn-avatars.huggingface.co/v1/production/uploads/641c500c21964f8f6d456bb5/8Ue0UMUF7yHs3KsEc7Ybm.png',
  'DMind-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6417e25e058f65de43201023/vip41KbG2p862jMqzrXX8.png',
  'DRAGON-LLM': 'https://cdn-avatars.huggingface.co/v1/production/uploads/62cd7b157a036fc9941bb688/Iq8G3ZtdIf0az9KcmDhyT.png',
  'Datalab': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67ab6afe315e622f597bf9e8/YOgg0gVYVXZC1PDIHFTWK.png',
  'DatologyAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64937e776a38c3a61e858659/iWIpAXj6cWT5KIOolKtF3.png',
  'DebateLab-at-KIT': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63c9266d86529da2095635cb/DOvNK2T_cX3j3QIq2SHDQ.png',
  'DecartAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6519816869c938b3d626ce6b/9dy5oRzZKPWaVf_0k7aV-.png',
  'Dedalus-HealthCare-GmbH': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6841994e5de37050956bfd2e/9HVrk8ZQNEonbAkkHEaZx.png',
  'Deep-Infra-Inc.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63f9178e9bf98d3ed29956ea/A_1-W5PdQzhltRjJh-uQC.jpeg',
  'DeepAuto.ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63cc9ff0336d9d5617143a03/6H6oci-cBw57rPlEs6UZ4.png',
  'DeepKeep': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66e940534eeaced24a396c48/FwtQU7ahdq16pYFhN-6YY.png',
  'Deepwin': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66c39b80182d5a69ae527025/to9kAFizDAwUf3fvvnvcm.png',
  'Diffbot': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6514541443afebbc0a708077/E7cLHrSY4XgyzqXm-oCg0.png',
  'Diffusers': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1668178606778-602e6dee60e3dd96631c906e.jpeg',
  'Diffusion-CoT': 'https://cdn-avatars.huggingface.co/v1/production/uploads/5f7fbd813e94f16a85448745/u7-k61BeAabAW9S4AUm94.png',
  'Dnotitia-Inc.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/62af434f457691d789c36aeb/ZeVYADUPsv_20G3FkybFf.jpeg',
  'Docling': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63c64dd877caf00391004e20/aWC70TyF2UhxyaUh1alpu.png',
  'Dolphin': 'https://cdn-avatars.huggingface.co/v1/production/uploads/68485b28c949339ca04c370c/U8ZDn5JZDJ0wr2nCCWUKZ.png',
  'Dropbox-Inc': 'https://cdn-avatars.huggingface.co/v1/production/uploads/68f669c3ecbab7fe8c24a431/1Wdfwky8XOZ8zJGgJFz-_.png',
  'ELYZA.inc': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1617247461025-602df472e7cbff387ba695f2.png',
  'EMOVA-Hugging-Face': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65bf3b304b5f8c270d50d6c8/C48ceaMjv9ZHewZFPp6Ii.png',
  'Eka-Care': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61dd41bf15398198eb366618/fPy-e6bcqkLb9f9YPZlzI.png',
  'Elastic': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64f0aefb84619eaa3b582ee3/ejfBYFD8q5fRVnKlf45zb.png',
  'Elyn-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6439f43a1514b7ee7fb616a1/l7RrUiR5d1Rg2t3mvt4vp.png',
  'Embedl': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6634fc18d94421fe1c02f97c/LdrpeOc1oX_NjGDfgQFNe.png',
  'Enkrypt-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65d437cdd717f5ae9512e02a/idyNO3i0FfjxTSzq7en96.jpeg',
  'Enterprise-Explorers': 'https://cdn-avatars.huggingface.co/v1/production/uploads/5fac18fb5eec0323e9470ba2/C4wc3-ecPFoXb3D8F4x2f.png',
  'Epidemic-Sound': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63283c87f416fb897ebf0dce/8y4lEDTQy5gOPg6KuFbLf.png',
  'EssentialAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66f59888850df13c40e41e03/16cvhTq9ynO67ItUU-75e.png',
  'EvolutionaryScale': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61ac8f8a00d01045fca0ad2f/jxZsP2y8v6mqfSlAUx8bF.jpeg',
  'FastVideo': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63565cc56d7fcf1bedb7d347/g6wWXLryVUwXcaKTuRerh.png',
  'Featherless-Serverless-LLM': 'https://cdn-avatars.huggingface.co/v1/production/uploads/663ba373cff439fa01e85e7b/_TNhXUVytBsaynocaHfvW.png',
  'FlagRelease': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67452ce17baa7dd7dd05347c/xuo-CMlHNMSiEZecWbQIl.jpeg',
  'FlyMy.AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/62627efa9517ea567fb93169/eFpqayZDpFZsAKULU43Zr.png',
  'Fortytwo': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63aeda3a2314b93f9e706a68/CzWINLFB8CFMMZaAuzxnn.png',
  'Fotographer.ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63f2ef1b7ddf724fbcc7757f/_oAgy7aP8ErsJ0aadEq5j.png',
  'Freepik': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61ac8f8a00d01045fca0ad2f/HlcA8Y94hVNOeIVPdTAB5.jpeg',
  'FriendliAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/638832b61901766b8807aeac/UOpqhkrkFUKM7HoQI_-9X.png',
  'FuriosaAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/620b6dc29412b0861cb2474a/Bl7ua2mXSFxk9rVo8vMA8.png',
  'General-Agents': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6311bda23a773344e068edc7/ODJiaXUKyRkyLotUnhJgS.png',
  'Gensyn': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66d252ec8a438492b0d6e4ce/KD6rJavI2N74-2aT7NiZc.jpeg',
  'Gigax': 'https://cdn-avatars.huggingface.co/v1/production/uploads/652feb6b4e527bd115ffd6c8/YFwodyNe6LmUrzQNmrl-D.png',
  'Gizmo': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61e989596aad5f3b1917b3a0/Lm113vX2lsgZYkA6tgD0Z.png',
  'GovTech---AI-Practice': 'https://cdn-avatars.huggingface.co/v1/production/uploads/655f4ff710e5c5fbef30fd97/hj1nVVjWDoUq8YeOJk-ux.png',
  'Gradio': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1654078732719-61d5c0530435582ab69f8f70.png',
  'Grammarly': 'https://cdn-avatars.huggingface.co/v1/production/uploads/60985a0547dc3dbf8a976607/rRv-TjtvhN66uwh-xYaCf.png',
  'Growth-Cadet': 'https://www.gravatar.com/avatar/4da2bbc4fe6b3d32a22ba63b633133df?d=retro&size=100',
  'H-company': 'https://cdn-avatars.huggingface.co/v1/production/uploads/677d3f355f847864bb644112/OQyAJ33sssiTDIQEQ7oH_.png',
  'H2O.ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1673570796144-63c0a91f7f52541dfc7c831b.png',
  'Haize-Labs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/635d50bf4fabde0df744a724/D3gQoRkbDC-PBjEYmUsZL.png',
  'HelloBible': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6464b3b680c7f0b43bf0548b/lUS2jjv_oAc1gIvYDE0gv.jpeg',
  'HorizonRobotics': 'https://cdn-avatars.huggingface.co/v1/production/uploads/636b4109c95145940b034bf9/pJbqajRIeOtKwQFLFSfSZ.jpeg',
  'Hugging-Face': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1583856921041-5dd96eb166059660ed1ee413.png',
  'Hugging-Face-H4': 'https://cdn-avatars.huggingface.co/v1/production/uploads/5f0c746619cb630495b814fd/j26aNEdiOgptZxJ6akGCC.png',
  'Hugging-Face-Smol-Models-Research': 'https://cdn-avatars.huggingface.co/v1/production/uploads/651e96991b97c9f33d26bde6/e4VK7uW5sTeCYupD0s_ob.png',
  'Hugging-Face-Vision-Language-Action-Models-Research': 'https://cdn-avatars.huggingface.co/v1/production/uploads/640e21ef3c82bd463ee5a76d/likntYrwaFC6V9-37pQHp.png',
  'HuggingFaceM4': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1653062669432-60741a2e69a66931a0273f0c.png',
  'HyperCLOVA-X': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67fcc27ab96b1493f981d24f/UZidculpAqDdQoXIUGNLe.png',
  'IBM-ESA-Geospatial': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65e5ffe063def32e811dd99a/D39B-hvRTQF5Q3KC5hJpx.png',
  'IBM-Granite': 'https://cdn-avatars.huggingface.co/v1/production/uploads/639bcaa2445b133a4e942436/CEW-OjXkRkDNmTxSu8Egh.png',
  'IBM-NASA-Prithvi-Models-Family': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63f73fb3d36951307fcd5c1f/XYXRWd1QvgbGKFtZKGxGp.png',
  'IBM-Research': 'https://cdn-avatars.huggingface.co/v1/production/uploads/637bfdf60dc13843b468ac20/npxapKcW-cXX3J2JBl2vY.png',
  'Icosa-Computing': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66a9cab0a8fa28c524dbb661/3tjh95QBxImZ5yVyxiZEC.png',
  'InclusionAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/662e1f9da266499277937d33/fyKuazRifqiaIO34xrhhm.jpeg',
  'Inect': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64e5c99e2fe9bc4bd3e68635/ba7-4xHPv0nzuNs-skMii.png',
  'Infosys-Enterprise': 'https://cdn-avatars.huggingface.co/v1/production/uploads/683973ed136fa9ca71580184/Lk3AvGgAXwYqdJQ_12WMn.png',
  'InstaDeep-Ltd': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6421f05beaad1bcb28b22696/gQ0Vh0-nEV3dvSBtXlKOj.png',
  'Institute-for-Computer-Science,-Artificial-intelligence-and-Technology': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64f1a0700af832a73d0f3e6f/KwpuATq29U2-Fu55OvUHR.png',
  'Institute-of-Smart-Systems-and-Artificial-Intelligence,-Nazarbayev-University': 'https://cdn-avatars.huggingface.co/v1/production/uploads/646dce272fd5a8eb8c51076d/5cOUyCGLo6Jk3UaLVpK-P.png',
  'Intel-Labs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63f7e4a249569335b6781c50/fL4XmnR_xsXSI7JZhq2_V.png',
  'InternRobotics': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65d9f09bbcd15bc5cb255fed/REfA3nEK1_Y-PTfGn_5H1.jpeg',
  'Ito': 'https://cdn-avatars.huggingface.co/v1/production/uploads/60f212675c0a037f6e864429/yvAk6q7RNq-UIsPAfEbXw.png',
  'JasperAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/68518db32ef258314713c5de/G0hrx3r8nqvF6ZFYYWH7s.png',
  'JetBrains': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6645d54b780d46f274dd4145/8RHS3MzGGBFWtH1-bynJ0.png',
  'JinaAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/603763514de52ff951d89793/wD54VbAHHyHop3uYlJKl4.png',
  'Jupyter-Agent': 'https://cdn-avatars.huggingface.co/v1/production/uploads/650ed7adf141bc34f91a12ae/IJtr0iyMD3eqODePzo5SH.png',
  'KMC-Solutions': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6690c045c7d72a1ae0cfad8e/2RTyLqJkkOvEUn0kTzX1s.png',
  'KRNL': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6311d4f08231e4718b946d77/p1Tce7CGLGA8uGjIsAAva.png',
  'KakaoCorp': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66c2a902b83a7e94d517c1ea/6Bo5zjJnRCtIi28zFUPmO.png',
  'Katanemo': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66b681906c8d3b36786b764c/uyP7mxDVv0HbV9Hv_KfHk.jpeg',
  'Katara': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6720bdefe7aadcc27f568349/7lAngQ6TTBU4BNYc6wUUg.png',
  'Kenpath-Technologies': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1663831793750-632c0d114a4991e7114f9dd8.png',
  'Khoj-Inc.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64b6f106104e7af01cf9eece/pW85a25IlQwHVm1sCnAU3.png',
  'KissanAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/616d9181c3bac80637586601/PmBHSLJHsfTbCEmsOrVD1.png',
  'Kolors-Team,-Kuaishou-Technology': 'https://cdn-avatars.huggingface.co/v1/production/uploads/62f0babaef9cc6810cec02ff/sVnELkcfVo5kxg5308rkr.png',
  'Kwaipilot': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6438cc09c04b3b996ea73196/izeqDmgIB27KPxPkisPSF.png',
  'LAMM:-MIT-Laboratory-for-Atomistic-and-Molecular-Mechanics': 'https://cdn-avatars.huggingface.co/v1/production/uploads/623ce1c6b66fedf374859fe7/Qw9Np_ESnnWWUm7HXleHR.jpeg',
  'LGAIResearch': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66a899a72f11aaf66001a8dc/UfdrP3GMo9pNT62BaMnhw.png',
  'LLM-jp': 'https://cdn-avatars.huggingface.co/v1/production/uploads/649259b1b2bcb8358cf77958/WEl_gpGpAWQte_podstYD.png',
  'LLM360': 'https://cdn-avatars.huggingface.co/v1/production/uploads/644bf65522d211df6444a7f4/7B9Y9bkBn6K1NDwlZH3dx.png',
  'LM-Studio-Community': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64445e5f1bc692d87b27e183/Quwh3tlKXa1y7aduVfxZi.png',
  'Language-Technologies,-Bangor-University': 'https://cdn-avatars.huggingface.co/v1/production/uploads/60520aaf8d9fa17e797173ec/qZVSjzFwmyqYNFiop2iHd.png',
  'Language-Technologies-Laboratory-@-Barcelona-Supercomputing-Center': 'https://cdn-avatars.huggingface.co/v1/production/uploads/60538e733efc404ddc7c0c0d/KNnLPW5-_JjQfFwARMmPX.png',
  'Lapa-LLM': 'https://cdn-avatars.huggingface.co/v1/production/uploads/607a1b6a921db717010c7ca9/9yQjocuwalSEPx8RZkLyw.jpeg',
  'Latitude': 'https://cdn-avatars.huggingface.co/v1/production/uploads/611494b423b498d2f9c7da2f/Nbz9s0FshIRmI6yl5Bi7B.jpeg',
  'LeRobot': 'https://cdn-avatars.huggingface.co/v1/production/uploads/631ce4b244503b72277fc89f/pcLUTLsvMQiR-ujlTgLYF.png',
  'Lelapa-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1667302140779-5fbf94dcf6c5c10afc0c9e09.png',
  'LightOnAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1651597775471-62715572ab9243b5d40cbb1d.png',
  'Lightricks': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1652783139615-628375426db5127097cf5442.png',
  'LiquidAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61b8e2ba285851687028d395/lJeGmNS6KV4y34ERo0Aop.jpeg',
  'LiveKit': 'https://cdn-avatars.huggingface.co/v1/production/uploads/658bc260fdf2279d4721fec6/d2ef90UpGmLbt0_4b5QJ7.png',
  'LlamaIndex': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6424f2be988b8b19edba5b73/NHVYrW0BnfWgrxt6Thh9C.png',
  'Locai-Labs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/68445936f4aaf3d8626535c3/G9b9VCqkhoRtfzKGnEltK.png',
  'Logiroad': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67a34432592f8e9ce2b06233/-0WQvpCg4j3kXE3MFsfFK.png',
  'LoveScapeAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/628e38f1c64b0daa908e8709/6JbwKolN1S7CwTHHqQjJw.png',
  'MBZUAI-IFM-Paris-Lab': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6087e598e2b7cc3a117b0dc5/JUiDkClou70ZdFQaiZ3hK.png',
  'MOGAM-(Institute-for-Biomedical-Research)': 'https://cdn-avatars.huggingface.co/v1/production/uploads/609c6e86710584cc7f5aba52/AU8f9hy6RMftmAqFzQZy_.png',
  'MacPaw-Way-Ltd.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65c610953f5ef63bb30dba0f/gDPAHvtgAxeWaOwoiWM_y.png',
  'Martian': 'https://cdn-avatars.huggingface.co/v1/production/uploads/632f9150961ceed0882ecc0e/2FxGkgwTRdo4UyxiKcR9j.png',
  'Masterclass': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64befba46999b520ed945e83/EEL_pS4_vqV-3Zk0gmatw.png',
  'MediaCatch': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63358001686c20e55973298d/9Rf_R1sNBFnVlHc5n5x2M.jpeg',
  'MeetKai': 'https://www.gravatar.com/avatar/41dd538e97226b6ad3f8568bb90e79ec?d=retro&size=100',
  'MenloResearch': 'https://cdn-avatars.huggingface.co/v1/production/uploads/643b63fea856622f978fdc35/c8ZIKZbg-Y4ZxkUgMLV8q.png',
  'Mesolitica': 'https://cdn-avatars.huggingface.co/v1/production/uploads/5e73316106936008a9ee6523/lBG9dK5tQU74OkxacXSeK.png',
  'Microsoft': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1583646260758-5e64858c87403103f9f1055d.png',
  'MiniMax': 'https://cdn-avatars.huggingface.co/v1/production/uploads/676e38ad04af5bec20bc9faf/dUd-LsZEX0H_d4qefO_g6.jpeg',
  'Minion-AI': 'https://www.gravatar.com/avatar/50042b1c21285225579fa2345b3f4673?d=retro&size=100',
  'Ministry-of-Digital-Affairs-of-Poland': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6786414e6e7cee9cef5c8333/7zLiruBaN_XcK8GyEv9DY.png',
  'Mirai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/660db01b9f07499ea9e33767/7Gli1lpUkncloHXdUpqBZ.png',
  'MiroMindAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/682c41fb2f8a52030ec93ce0/Cna52_IapEXuNBsyI3lvR.png',
  'Mixedbread': 'https://cdn-avatars.huggingface.co/v1/production/uploads/643ee0870d1194da249bd7fe/voYdYlFgQH5vyMwyMNluZ.png',
  'Miðeind-ehf.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1644945053640-5f92b3bd900a8b2c4af94216.png',
  'Modular,-Inc.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/vP-nEc4S7zyWnezWO9-PD.png',
  'Mohamed-Bin-Zayed-University-of-Artificial-Intelligence': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1643879908583-603ab5664a944b99e81476e8.jpeg',
  'Mozilla.ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6527fe5967966b675c44c223/XHst4nPyCsip5ciV3UImE.png',
  'Mímir-Project': 'https://cdn-avatars.huggingface.co/v1/production/uploads/5ef3829e518622264685b0cd/fItjjjFUKzN2vaCy5ce2Q.png',
  'NASA-IMPACT': 'https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/uhPSBH5LAJaZmhmSpbRUh.png',
  'NVIDIA': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1613114437487-60262a8e0703121c822a80b6.png',
  'NariLabs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/68048782f6b002c701d28273/VTM5MPtmg_TLow0HKiBMB.png',
  'Naseej': 'https://cdn-avatars.huggingface.co/v1/production/uploads/5f17f519925b9863e28ad519/zOI8vDWrBlF5seqTJKA3-.jpeg',
  'Nasjonalbiblioteket-AI-Lab': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1644417861130-5ef3829e518622264685b0cd.webp',
  'Neuphonic': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6273cb453d70b36612a9a053/kVe756WriD42PsjivCccP.png',
  'NewMind-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/660c05be387b035b0fc56bae/QzKfgwGy3O-IhWV8lH_RC.png',
  'NexaAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6618e0424dbef6bd3c72f89a/7d2FbaPIcDbjw07fVMWP-.png',
  'Nexusflow': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64e0f2f03209bf41948e1838/QxlEl98DOsWOHcavbVQ8h.png',
  'NineNineSix': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64fab67bd268b2f1ad8a826b/rowcj1bi24VuiYdlxLOkI.png',
  'Northell-Partners': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64e9010e5f3e15f981ffd739/mfiwxLmwAwGfPWqQh3oic.png',
  'Nosible-Ltd': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6621386772caca174449fdd3/N8Mp2-nPhVTvxzVW03j9e.png',
  'Not-Diamond': 'https://cdn-avatars.huggingface.co/v1/production/uploads/650a269ec19e5b4c8a622a80/bsucQvrbzaJRl4ZSyDXXv.png',
  'NousResearch': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6317aade83d8d2fd903192d9/tPLjYEeP6q1w0j_G2TJG_.png',
  'Novita-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6549cda7b8d6b1e86317b2ab/nDGzk_CdQsg9AVKQc7WFc.jpeg',
  'Numind-dev': 'https://cdn-avatars.huggingface.co/v1/production/uploads/649be8cf867d442094248a40/nyLuQQ5NipsUsVE9yVZ1c.png',
  'OnlyThings': 'https://www.gravatar.com/avatar/1b299eef2d88377e185e09a87e124901?d=retro&size=100',
  'Open-R1': 'https://cdn-avatars.huggingface.co/v1/production/uploads/651e96991b97c9f33d26bde6/QG_uzb2VV3OeKO0c61ynh.png',
  'OpenAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/68783facef79a05727260de3/UPX5RQxiPGA-ZbBmArIKq.png',
  'OpenBMB': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1670387859384-633fe7784b362488336bbfad.png',
  'OpenDataLab': 'https://cdn-avatars.huggingface.co/v1/production/uploads/639c3afa7432f2f5d16b7296/yqxxBknyeqkGnYsjoaR4M.png',
  'OpenHands': 'https://cdn-avatars.huggingface.co/v1/production/uploads/60de14638bedd2315529d43f/0wtwE5zREJGGMOLg_gthj.png',
  'OpenMOSS': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61457b8deff2c9fdb4de4988/N5b9663zQ4uq5_OTNlnmw.png',
  'Orange': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63690a9d85fef3ca96e2702a/O8F16nMB4a5bOkCRS3__v.png',
  'PT-GoTo-Gojek-Tokopedia-Tbk': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64429c5f6a98551380e881b0/Yg5KvQyqLuAzJINEZZ5XR.jpeg',
  'PaddlePaddle': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1654942635336-5f3ff69679c1ba4c353d0c5a.png',
  'Palisade-Research': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65f878b3686527a41c3edf58/wi0F7CPX3w4SvKT93EdmR.png',
  'Parasail': 'https://cdn-avatars.huggingface.co/v1/production/uploads/674371a95843b8e3fa6800e7/3jwJcHMsMadl4dOZe5eCO.png',
  'Patronus-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/jOAWAvmqOod2rYsgdxF0w.png',
  'Perplexity': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64b89bf66b5ee8c38859cbd6/l_27fD52uFMZUXdFdY9fR.png',
  'Photoroom': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1608816711384-5fe497b773152f333e959e6f.png',
  'Pieces': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6835f5016800461ab206a94c/EyOkmgvvzxZYntOlllFq9.jpeg',
  'Polaris-Lab-(Princeton)': 'https://cdn-avatars.huggingface.co/v1/production/uploads/617aafa1ff3db6021d069787/EJQKkxzcDFSbIj6NdAhN_.png',
  'Pollen-Robotics': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64b7a31827e9345eafcf54e3/X0LNkSfmpPF0MAxVqetZT.jpeg',
  'PraxySanté': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64459ae15691ca69b0dd795e/pVk1-H-3YtP1LNmaMeHcM.png',
  'Predibase': 'https://cdn-avatars.huggingface.co/v1/production/uploads/645db37dd90782b1a6aa3883/pl9CTh_0tVYfW42y3N9VR.png',
  'Prem': 'https://cdn-avatars.huggingface.co/v1/production/uploads/5f440d8f79c1ba4c353d0f6d/7L8t7gH_KfIGyHT3cmrU3.png',
  'PrimeIntellect': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61e020e4a343274bb132e138/H2mcdPRWtl4iKLd-OYYBc.jpeg',
  'Project-Aria-from-Meta-Reality-Labs-Research': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66ce22b5a3ce189b05df4111/_HwnJ0enqU7ET892nK3T_.jpeg',
  'Project-Numina': 'https://cdn-avatars.huggingface.co/v1/production/uploads/661d3f3e85f70e208d6f20db/kaXbnZDekN1gPzmRG_aFV.png',
  'Protect-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/659ef92844a230e92ca777f5/JYJtH-Xs1UpWKwjSndlh5.png',
  'PrunaAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/653772fed7616b72795db894/1GPjjeZP_RGRl1pYgFdZc.png',
  'Psyche-Foundation': 'https://cdn-avatars.huggingface.co/v1/production/uploads/630581db99870e13d3e0006f/SgI_DpriB8bBIu3LEEG-o.jpeg',
  'PublicaAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/68cc2c6a121a2726e35fe967/1nXScnHniMmswhxfQEqv7.png',
  'PurpleSmartAI,-INC': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66f26c98cd83638ab37a63cc/i7F4ZQY00gsOrSTaKl2NS.png',
  'QA.tech': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64be70ed4561d0aca2bc217f/P1swnQN-hzzXIl6ytxHPG.jpeg',
  'QVAC': 'https://cdn-avatars.huggingface.co/v1/production/uploads/68d540a9b913fd49b5e41e0b/ooEaWBPmchmGPmfjyAXEr.png',
  'Qualcomm': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65c2710dc79c1a6e4d22734d/kB7OTGVsC1DPMIV2femsf.png',
  'Qualifire-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6536152811c8c094d4074d67/nZA6i954-RNdY8Zi_rk2d.png',
  'Qwen': 'https://cdn-avatars.huggingface.co/v1/production/uploads/620760a26e3b7210c2ff1943/-s1gyJfvbE1RgO5iBeNOi.png',
  'Qwerky-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6750e14b569ee92698844256/ipEfvxHUe1lZ4HzSiGF0_.png',
  'ROBOTIS': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67777799f2e3867089b258cd/EZL4AgipSmvb5WELBCV8c.png',
  'RapidFire-AI,-Inc.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/688be5f2beb2f074265a9968/Y-EjHexQkIl02bee6rAqr.png',
  'Raspberry-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61ac8f8a00d01045fca0ad2f/B5SnO0NoHbTNB-rrtXVqj.jpeg',
  'Raw-Power-Labs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66a76f64909a525bcbb22d24/mPsqWuATlH1XyjAErElzt.png',
  'ReadyAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65c6822a10735dcd76f20fb8/5TTi_r35-vVu7rbiUWJ9p.png',
  'Red-Hat-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/60466e4b4f40b01b66151416/cdABRow21BL0sl1vSVTPk.png',
  'Reducto': 'https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/lv_uI9PxADxMA1fjRPisH.png',
  'Relace-Team': 'https://cdn-avatars.huggingface.co/v1/production/uploads/665fa199c42cab782fad690f/F0ZGiyMFntzLaj27v_Rxx.png',
  'Remyx-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/647777304ae93470ffc28913/ZNYVu05hqiHa7pcOSDU74.png',
  'Resaro': 'https://cdn-avatars.huggingface.co/v1/production/uploads/668fa6127be24e3ceafb4c2d/KZchNVMFB8HQ5ZjvQCc17.png',
  'ResembleAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6000a0456a2a91af974298cf/qmxSbcVBCwUtVez918IkQ.png',
  'Roblox-Corporation': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6438428526c25444413c54d1/zHEWe9jE0_osXQZ1f4tRl.png',
  'Runware': 'https://cdn-avatars.huggingface.co/v1/production/uploads/641caf6c043963b1c0a27256/-w4w2t9r-T3U2LqzF2jqe.png',
  'SAFE-Challenge': 'https://www.gravatar.com/avatar/2639fab1c71c7fbebe113bd68f7f21fc?d=retro&size=100',
  'SAP': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67f7a0ad07b08a2b3c3ac94e/lIw9a3y-z_5RGc7i64YPu.png',
  'SIL-Global---AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1627932631028-6108057a823007eaf0c7bd10.png',
  'SILMA-AI---Arabic-Language-Models': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63d7acf73130cadcaf827e84/nUnkzwVfdf1MrN5JG_lm5.png',
  'Sailplane': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63c700b350cc81901da97b69/LywF9WuBDPSuTYVcGcC1o.png',
  'SaruLab-Speech-group': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1622109071965-60ae967a8e0be37dee869ee3.png',
  'ServiceNow': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1664391313869-62f6691f329d4d014d1b4087.png',
  'ServiceNow-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63d3095c2727d7888cbb54e2/Uv-Lx8PVGviqokfOyYlCN.png',
  'ShakkerLabs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/637745113a63a2983ffbde13/7xAiWo1UplT25dyzWR3tv.png',
  'Shisa.AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63a7422854f1d0225b075bfc/I72uxtu5pkBCsP3c2VZYz.png',
  'SketchPro-Technologies,-Inc.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/62e71fc504606f44feaeca22/R0sSZJbNAeJXFf4sWbxdJ.png',
  'Snorkel-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1641327454607-608849cadf398c3b285ce95b.png',
  'Snowflake': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64dc52cf858f8a41c12fc819/O9-MWzRjWzbNP_DQlMb-7.png',
  'Sony': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61ac8f8a00d01045fca0ad2f/zpgaCDJEHxA8kYNDtMKnv.jpeg',
  'Sparticle': 'https://cdn-avatars.huggingface.co/v1/production/uploads/647b2539c3c809c69d2f260f/nD29_4oR758LfTmtGDdEE.jpeg',
  'Stanford-Shah-Lab': 'https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/nuL-m7tDyxhM4mSQ_t_Ty.png',
  'Stockmark-Inc.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1673940766212-6344e70487964b3318101419.png',
  'Straker-Ltd': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64936b35a682ffd576f4abf5/u4xI4C7Bk-kRXhBZRe1a2.jpeg',
  'Superapp-Labs': 'https://www.gravatar.com/avatar/8d70277dbdde62fafb4966e30a7c4f14?d=retro&size=100',
  'Swiss-AI-Initiative': 'https://cdn-avatars.huggingface.co/v1/production/uploads/648211d39c44e3422ca7e4f3/gnfixzw9IqBziR6bzA6u8.png',
  'Synaptics': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64eef540122336b81e2e36d7/FwR4ouQp-vCn2wPTng2-J.png',
  'Synthetic-Lab': 'https://cdn-avatars.huggingface.co/v1/production/uploads/660fe99c32da825fb919d596/bbG5aBzC0VpE7kfkHRoFM.png',
  'Synthyra': 'https://cdn-avatars.huggingface.co/v1/production/uploads/62f2bd3bdb7cbd214b658c48/mQ_pTcH7roclgb38VHXAZ.png',
  'TMFI-Consulting': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6524889b563d19d7849bd305/4e21M1u5Ibp4rGnjk59aP.png',
  'TNG-Technology-Consulting-GmbH': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6633a97f48350281a60069c1/3GO_f_ovY6JJWEgn0OE2r.png',
  'TOE': 'https://www.gravatar.com/avatar/87e66a83e4c3fc6405294a806b399a3b?d=retro&size=100',
  'Tangering-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/654b0d30141d928a4384e85a/L8CsH2ANH4q3L0rCUhKWz.png',
  'TechWolf': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1655210345500-61f4302157368ff46da55398.png',
  'Technology-Innovation-Institute': 'https://cdn-avatars.huggingface.co/v1/production/uploads/61a8d1aac664736898ffc84f/AT6cAB5ZNwCcqFMal71WD.jpeg',
  'Tencent': 'https://cdn-avatars.huggingface.co/v1/production/uploads/5dd96eb166059660ed1ee413/Lp3m-XLpjQGwBItlvn69q.png',
  'Tennr': 'https://cdn-avatars.huggingface.co/v1/production/uploads/642b66b17f152f6e72b6c594/FHqwrrPFZxPNZN4E1HSlg.png',
  'TensorBlock': 'https://cdn-avatars.huggingface.co/v1/production/uploads/669fe82f9551d92af937cb6e/8AZLNSQw859vmJZfyan0p.jpeg',
  'TensorStack-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/654d6c55f3c69b38d59bd4bb/IB6ZvreqweeoIggS_rS5L.png',
  'Tensorlake-Inc': 'https://cdn-avatars.huggingface.co/v1/production/uploads/644598bf14d3df8e1301716e/DvxF3yCd19N9qHJ0NARWv.png',
  'The-AI-Institute': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66a10bba8645e7fa2629bde6/PkAhioJS-LZ5s-COqRpgi.png',
  'ThinkOnward': 'https://cdn-avatars.huggingface.co/v1/production/uploads/666a402e77d119acc27a5c8d/mVaKaeqWIu9Ju0CJxyAoq.png',
  'Tiime': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65faf10ebfe25edace8ab8d9/q20HHYamTK0sUwdHUbYhX.png',
  'Together': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1678734258201-6322ad266b1992383fa964ca.png',
  'Toyota-Research-Institute': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6150b090d84cf0532aa1764b/PRbgRfhJ-8xWF4GteD1Tf.png',
  'Trelis': 'https://cdn-avatars.huggingface.co/v1/production/uploads/647479a17d131daf633c108d/IS5jNkSSB5wE2kbtW7QqA.png',
  'Trillion-Labs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67283291eebb94a257ef8937/3kgTX1eLqIcJSKuYiK6kl.png',
  'Tzafon-inc': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6724eb4af02d12fa8c17b214/7dPg1bOt2_tPtO2y1l93m.jpeg',
  'UTTER---Unified-Transcription-and-Translation-for-Extended-Reality': 'https://cdn-avatars.huggingface.co/v1/production/uploads/62262e19d36494a6f743a28d/1RJ1KWnGHD4h987dVzACV.png',
  'Ubitus-K.-K.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66261d846f325cc638eabfaa/kYzjSwsGpxEmYhnbdq8o8.png',
  'UltravoxAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/628d700fdb4cd1d1717c7d2f/m9n8O1Jk88UadmN6GoLNR.png',
  'Unbabel': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1676055757658-60d9a9791fa5d458da77754d.png',
  'Unsloth-AI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/62ecdc18b72a69615d6bd857/E4lkPz1TZNLzIFr_dR273.png',
  'Useful-Sensors-Inc.': 'https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/TXG6u2PtGnohUXBQwj2Ks.png',
  'VAGO-Solutions': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64b999a40b24527e9c25583a/o2ftNCIY1hlLlrCVKCHHB.png',
  'VLABench': 'https://www.gravatar.com/avatar/53e61e0b70039c7ca67a2ae1f5a0d267?d=retro&size=100',
  'VNGRS': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6147363543eb04c443cd4e39/0L0SjQq6Q4SRIVnZnMqCF.png',
  'Vespa.ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6120cacbdfb5b71a55dc938d/jRm5ClYzVXsMk0OPmBPxX.png',
  'VibeStudio': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66ace8b23b4065ce66a53aae/njKJmRzspikniGbtAEpwR.png',
  'Virtuos-rnd': 'https://www.gravatar.com/avatar/318745f26737249824c66ad50784b5bd?d=retro&size=100',
  'Vyvo': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6671781ea4dd9ce9169ac477/-9Czwfjkg1F3Nfpq2PM-D.png',
  'WaveSpeedAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63da0182897746d649662028/3FNgHXcYdn10fxPl3pni-.jpeg',
  'Writer': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1625001569797-60db8b5ad8b4797b129145d5.png',
  'Xiaomi-MiMo': 'https://cdn-avatars.huggingface.co/v1/production/uploads/680cb7d1233834890a64acee/5w_4aLfF-7MAyaIPOV498.jpeg',
  'Yala-Lab': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6333a9195a032dcd095dda13/r-7psCzH30cILTNWRQ60N.png',
  'Z.ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/62dc173789b4cf157d36ebee/i_pxzM2ZDo3Ub-BEgIkE9.png',
  'Zed-Industries': 'https://cdn-avatars.huggingface.co/v1/production/uploads/639ea15572706670112a18d4/bNqJ2nnIUymlNjeUJCj--.png',
  'Zentropi': 'https://cdn-avatars.huggingface.co/v1/production/uploads/654ab50394d809b4e7549fca/kCNe_Jn7f7KHnJ9Zs4nIo.jpeg',
  'Zero-Systems': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6500acaff355a888f9488fbd/A7Sc_uOdehVG6z7C8Gxue.png',
  'ZeroAgency': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6303ea40a362e7e8b51cea6b/d7OajszMQ4CEfsA-2FKGf.jpeg',
  'Zyphra': 'https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/jxR_DdbmmulkyLubYqfMv.png',
  'ai-sage': 'https://www.gravatar.com/avatar/c25dce36e8c9988e91e82c9fa3f7a469?d=retro&size=100',
  'aipicasso': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1672468373395-60348737e8149a962412a68a.png',
  'allganize': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63c56cc80c24c8b53961728d/IcwsTDvdNR-uznsS1fqbp.png',
  'altai.dev': 'https://cdn-avatars.huggingface.co/v1/production/uploads/5f2ecf4a7e58354338620d1f/rMDp9DJsX5dBnXMHkyCa6.jpeg',
  'baseten': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1679264816869-62eaffb6d22ea50786b2a30d.jpeg',
  'covenant': 'https://cdn-avatars.huggingface.co/v1/production/uploads/68342a694f6d5e77c873556d/3JixCctA9BL0Wq8AjOior.png',
  'daisy': 'https://cdn-avatars.huggingface.co/v1/production/uploads/670e902c8b46eb60dc4c4487/WOqjLPCEl1Fxj3CCxhyov.png',
  'diffusers-internal-dev': 'https://www.gravatar.com/avatar/526387de98bd7d5b70e7b142c5bb63bf?d=retro&size=100',
  'drc-8': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1665536729825-606296de21cc4e7bf31dc5b4.png',
  'eh-quizz': 'https://www.gravatar.com/avatar/07687b93360029baedf24b9c5e04aaa0?d=retro&size=100',
  'ellamind': 'https://cdn-avatars.huggingface.co/v1/production/uploads/647ef81ce9c81260ff84fdd7/G2Ftt38LatXWWu3CX9izs.png',
  'empathy.ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6790b0f663a1749408dc6851/GclxLtGatnIyeOgICan9B.png',
  'esa-sceva': 'https://cdn-avatars.huggingface.co/v1/production/uploads/62790e6abba7c62cbab0ccaa/UvsQaWs8zoFOtGyUjnDAs.png',
  'fal': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6380ebb8471a4550ff255c62/JLWd_lQkzQN81FVIva1w1.png',
  'fastino': 'https://cdn-avatars.huggingface.co/v1/production/uploads/66200c685c7af6bb12e399ff/K4H8nyLbP3ODiTk3m4CqC.jpeg',
  'fusionbase': 'https://cdn-avatars.huggingface.co/v1/production/uploads/1672731776679-625484fc4d99a976dba51c58.jpeg',
  'ggml.ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/63148d3b996c52bf0142cdbe/HXyNkyB0_nHI5WDNdiKHZ.png',
  'google': 'https://cdn-avatars.huggingface.co/v1/production/uploads/5dd96eb166059660ed1ee413/WtA3YYitedOr9n02eHfJe.png',
  'ibm-ai-platform': 'https://cdn-avatars.huggingface.co/v1/production/uploads/660eeae04f7a69c50cf2ab99/mutmOPu-hv2RTKg5xihuy.jpeg',
  'identity-ai-labs': 'https://cdn-avatars.huggingface.co/v1/production/uploads/675f480ed33bf691a5f2095d/oXLw4ILXGgnWdXZ3HFprr.jpeg',
  'kernels-community': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6452d5ba3f80ad88c77b2f05/0J-xey5Z1dh9ZOyTyyTge.png',
  'legml.ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/639c5c448a34ed9a404a956b/d0-xNWyRNOzlrCwOZD3Qf.png',
  'meta-llama': 'https://cdn-avatars.huggingface.co/v1/production/uploads/646cf8084eefb026fb8fd8bc/oCTqufkdTkjyGodsx1vo1.png',
  'mistralai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/634c17653d11eaedd88b314d/9OgyfKstSZtbmsmuG8MbU.png',
  'moondream': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65df6605dba41b152100edf9/LEUWPRTize9N7dMShjcPC.png',
  'sionic-ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/64ef68e04a9ce403b210f307/s9Rcsvnjz1v2HunQy9rY4.png',
  'stabilityai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/643feeb67bc3fbde1385cc25/7vmYr2XwVcPtkLzac_jxQ.png',
  'thestage.ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/67991798ae62bd1f17cc22ed/y3i5J8IMLrDax_2W2Hjil.png',
  'thirdeye-Ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/659b1661e1604bf996c8e5b9/EEx8O22tf0t_m8yHNIlG2.png',
  'tokyotech-llm': 'https://cdn-avatars.huggingface.co/v1/production/uploads/6308c49c454dc257521bc7f9/fQaar5JAw6UMH9pnYOcLE.png',
  'xAI': 'https://cdn-avatars.huggingface.co/v1/production/uploads/65f32e8277a2f0e983437469/fKpP0Yowa29vJHK9JSnBf.png',
  'xMAD.ai': 'https://cdn-avatars.huggingface.co/v1/production/uploads/noauth/2f_AD9rAdVzktRR2eClwz.png',
};

// Concurrency / throttling tunables
// const HF_ENRICH_CONCURRENCY = 4; // parallel per-model enrichment (with API key, we can do more) - DISABLED to avoid rate limiting
const HF_PAGE_LIMIT = 100;        // page size when querying HF

// All organizations - Keep ORIGINAL casing from database
const ALL_ORGS = {
  tier_1: [
    'OpenAI', 'meta-llama', 'facebook', 'google', 'Microsoft', 'Anthropic', 'NVIDIA', 'xAI', 'Apple', 'Amazon',
    'Tencent', 'Baidu', 'ByteDance', 'IBM-Granite', 'IBM-Research', 'AMD', 'mistralai', 'DeepSeek-AI', 'Qwen',
    'stabilityai', 'Black-Forest-Labs', 'Cohere', 'AI21Labs', 'Qualcomm', 'PaddlePaddle', 'SAP', 'ServiceNow',
    'InstaDeep', 'Roblox', 'Orange', 'AI-Singapore', 'Ministry-of-Digital-Affairs-Poland', 'Tenstorrent', 'PaloAltoNetworks',
    'Sony', 'Toyota-Research-Institute', 'Common-Crawl-Foundation', 'ibm-ai-platform', 'DoorDash',
    'Hugging-Face', 'Hugging-Face-Smol-Models-Research', 'Red-Hat-AI', 'Hugging-Face-H4',
    'Hugging-Face-Vision-Language-Action-Models-Research', 'EMOVA-Hugging-Face'
  ],
  tier_2: [
    'Databricks', 'Snowflake', 'GretelAI', 'Nixtla', 'Deci', 'BRIAAI', 'Core42', 'H2O.ai', 'Upstage', 'ZhipuAI',
    'LiquidAI', 'JinaAI', 'Lightricks', 'LGAIResearch', 'MiniMax', 'Perplexity', 'StepFun', 'Z.ai', 'NariLabs',
    'ArceeAI', 'TogetherAI', 'HuggingFaceM4', 'ResembleAI', 'JetBrains', 'HyperCLOVA-X', 'Zyphra', 'NexaAI',
    'MenloResearch', 'ServiceNow-AI', 'WhiteRabbitNeo', 'Nanonets', 'ShopifyAI', 'CanopyLabs', 'JasperAI',
    'DeepCogito', 'PrimeIntellect', 'MayaResearch', 'Project-Numina', 'OpenDataLab', 'LLM360', 'fal',
    'CiscoFoundationAI', 'moondream', 'UltravoxAI', 'Kwaipilot', 'Writer', 'Neuphonic', 'Gradio', 'Nexusflow',
    'smolagents', 'NerdyFace', 'Latitude', 'Freepik', 'LanguageTechLab-BSC', 'Gensyn', 'KakaoCorp', 'Mixedbread',
    'PrunaAI', 'LightOnAI', 'EssentialAI', 'TNG-Consulting', 'TensorBlock', 'OpenHands', 'ELYZA', 'KittenML',
    'Nasjonalbiblioteket-AI-Lab', 'MiroMindAI', 'EvolutionaryScale', 'VIDraft', 'Finegrain', 'GoTo-Gojek-Tokopedia',
    'Elastic', 'IamCreateAI', 'InternRobotics', 'LlamaIndex', 'Pollen-Robotics', 'Manus-AI', 'Grammarly', 'K-Intelligence',
    'Supertone', 'Datalab', 'Argmax', 'Katanemo', 'Protect-AI', 'Mesolitica', 'Trelis', 'Bespoke-Labs', 'Trillion-Labs',
    'VAGO-Solutions', 'KREA', 'Chai-AI', 'DecartAI', 'Tahoe-Bio', 'Build-AI', 'Predibase', 'Snorkel-AI', 'VNGRS', 'FuriosaAI', 'Datadog',
    'Unsloth-AI', 'Zed-Industries', 'Unbabel', 'Reducto'
  ],
  tier_3: [
    'EleutherAI', 'TIIUAE', 'BAAI', 'BigCode', 'OpenBMB', 'allenai', 'Ai2', 'OpenAssistant', 'SmolModelsResearch', 'LeRobot',
    'CohereLabs', 'InclusionAI', 'ShakkerLabs', 'HiDreamAI', 'KuaishouTech', 'VoyageAI', 'Timm', 'MIT', 'WangLab', 'MIMS-Harvard',
    'VanDijkLab', 'StanfordAIMI', 'AnswerDotAI', 'Idea-CCR', 'Nexusflow-Research', 'LeRobot-Worldwide-Hackathon',
    'Swiss-AI-Initiative', 'Docling', 'HuggingScience', 'LongCat', 'KAISAR', 'Agentica', 'Dolphin', 'Diffusers', 'AIDC-AI',
    'IBM-NASA-Prithvi', 'AgiBotWorld', 'H-company', 'Xiaomi-MiMo', 'LLM-jp', 'ArcInstitute', 'UTTER-XR', 'ai-sage', 'TheFinAI',
    'OpenMOSS', 'CommonPile', 'XetTeam', 'HuggingFace-Sheets', 'kernels-community', 'ESCP', 'FastVideo', 'OpenEnv', 'wut?',
    'tokyotech-llm', 'nltpt', 'gg-hf-gm', 'Institute-for-Computer-Science-AI-and-Tech', 'Institute-of-Smart-Systems-AI',
    'Future-House', 'IBM-ESA-Geospatial', 'Institutional-Data-Initiative', 'Athena-Research-Center', 'LlamaHack', 'gg-hf',
    'Apollo-LMMs', 'Jupyter-Agent', 'DICTA', 'NASA-IMPACT', 'LibreChat', 'University-of-Zurich',
    'LM-Studio-Community', 'NousResearch', 'ByteDance-Seed', 'Open-R1', 'Technology-Innovation-Institute', 'ggml.ai',
    'Kolors-Team,-Kuaishou-Technology', 'IBM-NASA-Prithvi-Models-Family', 'Together', 'Mohamed-Bin-Zayed-University-of-Artificial-Intelligence',
    'InstaDeep-Ltd', 'Language-Technologies-Laboratory-@-Barcelona-Supercomputing-Center', 'Roblox-Corporation', 'Arm',
    'UTTER---Unified-Transcription-and-Translation-for-Extended-Reality', 'TNG-Technology-Consulting-GmbH', 'ELYZA.inc',
    'Ministry-of-Digital-Affairs-of-Poland', 'PT-GoTo-Gojek-Tokopedia-Tbk', 'Institute-for-Computer-Science,-Artificial-intelligence-and-Technology',
    'Institute-of-Smart-Systems-and-Artificial-Intelligence,-Nazarbayev-University', 'Athena-Research-Center-|-Institute-for-Language-and-Speech-Processing',
    'DICTA:-The-Israel-Center-for-Text-Analysis', 'VibeStudio', 'FlyMy.AI', 'Photoroom', 'Featherless-Serverless-LLM', 'Mozilla.ai',
    'Arcee-Training-Org', 'LAMM:-MIT-Laboratory-for-Atomistic-and-Molecular-Mechanics', 'NineNineSix', 'Dnotitia-Inc.',
    'SILMA-AI---Arabic-Language-Models', 'Novita-AI', 'Lelapa-AI', 'MBZUAI-IFM-Paris-Lab', 'Patronus-AI', 'Shisa.AI', 'Vyvo',
    'CAMeL-Lab', 'fastino', 'baseten', 'MeetKai', 'LiveKit', 'TensorStack-AI', 'DMind-AI', 'Fotographer.ai', 'Axolotl-AI',
    'Useful-Sensors-Inc.', 'Stanford-Shah-Lab', 'Crusoe-AI', 'Psyche-Foundation', 'aipicasso', 'Intel-Labs', 'Not-Diamond',
    'WaveSpeedAI', 'NewMind-AI', 'Enterprise-Explorers', 'PurpleSmartAI,-INC', 'Epidemic-Sound', 'Chan-Zuckerberg-Initiative',
    'Lapa-LLM', 'SIL-Global---AI', 'thirdeye-Ai', 'FriendliAI', 'allganize', 'Masterclass', 'AskUI', 'DatologyAI',
    'Project-Aria-from-Meta-Reality-Labs-Research', 'GovTech---AI-Practice', 'Modular,-Inc.', 'Stockmark-Inc.', 'Eka-Care',
    'Aleph-Alpha-Research', 'Collinear-AI', 'MacPaw-Way-Ltd.', 'Remyx-AI', 'CGIAR', 'Synaptics', 'TechWolf', 'HorizonRobotics',
    'Vespa.ai', 'Prem', 'DRAGON-LLM', 'Synthyra', 'Diffbot', 'Elyn-AI', 'ByteShape', 'Resaro', 'Cantina,-Inc.', '1X',
    'Raspberry-AI', 'Runware', 'Miðeind-ehf.', 'SaruLab-Speech-group', 'Martian', 'AngelSlim', 'AIdeaLab', 'sionic-ai',
    'Mímir-Project', 'ZeroAgency', 'Tzafon-inc', 'Deepwin', 'Language-Technologies,-Bangor-University', 'KissanAI',
    'Qualifire-AI', 'FlagRelease', 'Ubitus-K.-K.', 'Gigax', 'AgentSea', 'AI71', 'SAFE-Challenge', 'Fortytwo', 'Consensus',
    'drc-8', 'QVAC', 'ellamind', 'diffusers-internal-dev', 'xMAD.ai', 'empathy.ai', 'thestage.ai', 'Haize-Labs', 'Naseej',
    'Northell-Partners', 'ThinkOnward', 'General-Agents', 'Parasail', 'Atomic-Canyon', 'Yala-Lab', 'ROBOTIS', 'Clarifai',
    'Kenpath-Technologies', 'Acuvity-Inc', 'Amini', 'altai.dev', 'legml.ai', 'Palisade-Research', 'Diffusion-CoT',
    'The-AI-Institute', 'Adalat-AI', 'Polaris-Lab-(Princeton)', 'covenant', 'KRNL', 'Enkrypt-AI', 'Raw-Power-Labs', 'VLABench',
    'identity-ai-labs', 'AI-Squared,-Inc.', 'AUGMXNT', 'DATUMO', 'AIM-Intelligence', 'Dedalus-HealthCare-GmbH', 'PraxySanté',
    'Sparticle', 'Zero-Systems', 'Corto', 'Algorithmic-Research-Group', 'Zentropi', 'Pieces', 'Minion-AI',
    'SketchPro-Technologies,-Inc.', 'DebateLab-at-KIT', 'DeepKeep', 'Black-Hills-Information-Security', 'Virtuos-rnd',
    'Deep-Infra-Inc.', 'Inect', 'Synthetic-Lab', 'Mirai', 'CTW', 'LoveScapeAI', 'Chutes', 'eh-quizz', 'TOE', 'BRICKS',
    'Locai-Labs', 'Qwerky-AI', 'Bylaw', 'Superapp-Labs', 'QA.tech', 'Tensorlake-Inc', 'Embedl', 'Logiroad', 'BioAge-Labs',
    'Cirrascale-Cloud-Services', 'Alpha-Singularity', 'Allegro-Lab-@-USC', 'MOGAM-(Institute-for-Biomedical-Research)',
    'Infosys-Enterprise', 'RapidFire-AI,-Inc.', 'PublicaAI', 'Dropbox-Inc', 'Tennr', 'Acellera', 'HelloBible', '42-Labs',
    'Call-Center-Studio', 'KMC-Solutions', 'Bynesoft-Ltd.', 'DeepAuto.ai', 'Numind-dev', 'AGI-Inc', 'OnlyThings', 'Charles-Elena',
    'ReadyAI', 'Relace-Team', 'Arc-Intelligence', 'Straker-Ltd', 'Khoj-Inc.', 'Growth-Cadet', 'Cosmonauts-&-Kings', 'Aumo-S/A',
    'Cribl,-Inc.', 'Sailplane', 'daisy', 'ConfidentialMind', 'Katara', 'Icosa-Computing', 'Ito', 'Gizmo', 'BoldVoice', 'Axur',
    'TMFI-Consulting', 'Tiime', 'Tangering-AI', 'Commotion', 'Nosible-Ltd', 'esa-sceva', 'fusionbase', 'MediaCatch'
  ]
};

function norm(s = '') {
  return (s || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[._\s\/\\]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to find publisher image with case-insensitive fallback
function getPublisherImage(publisherName) {
  if (!publisherName) return null;

  // Try exact match first
  if (PUBLISHER_IMAGES[publisherName]) {
    return PUBLISHER_IMAGES[publisherName];
  }

  // Try case-insensitive match
  const lowerName = publisherName.toLowerCase();
  for (const [key, value] of Object.entries(PUBLISHER_IMAGES)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }

  return null;
}

function computeCanonicalId(m) {
  if (!m) return `unknown:${Math.random().toString(36).slice(2, 9)}`;

  // For cross-source deduplication, use normalized model_id (publisher/name format)
  // This ensures the same model from different sources gets the same canonical ID
  if (m.model_id) {
    return norm(m.model_id);
  }

  // Fallback to specific IDs if model_id is missing
  if (m.huggingface_id) return norm(m.huggingface_id);
  if (m.openrouter_id) return norm(m.openrouter_id);

  // Construct from publisher + name as last resort
  const pub = norm(m.publisher || m.source || '');
  const name = norm(m.name || '');
  if (pub && name) return `${pub}-${name}`;
  if (name) return norm(name);

  return `unknown:${Math.random().toString(36).slice(2, 9)}`;
}

/* ---------- Tier classification ---------- */
const PUBLISHER_TIER_MAP = {
  // Tier 1 - Major companies
  'OpenAI': 'tier_1', 'meta-llama': 'tier_1', 'facebook': 'tier_1', 'google': 'tier_1',
  'Microsoft': 'tier_1', 'Anthropic': 'tier_1', 'NVIDIA': 'tier_1', 'xAI': 'tier_1',
  'Apple': 'tier_1', 'Amazon': 'tier_1', 'Tencent': 'tier_1', 'Baidu': 'tier_1',
  'ByteDance': 'tier_1', 'IBM-Granite': 'tier_1', 'IBM-Research': 'tier_1', 'AMD': 'tier_1',
  'mistralai': 'tier_1', 'DeepSeek-AI': 'tier_1', 'Qwen': 'tier_1', 'stabilityai': 'tier_1',
  'Black-Forest-Labs': 'tier_1', 'Cohere': 'tier_1', 'AI21Labs': 'tier_1', 'Qualcomm': 'tier_1',
  'PaddlePaddle': 'tier_1', 'SAP': 'tier_1', 'ServiceNow': 'tier_1', 'InstaDeep': 'tier_1',
  'Roblox': 'tier_1', 'Orange': 'tier_1', 'AI-Singapore': 'tier_1',
  'Ministry-of-Digital-Affairs-Poland': 'tier_1', 'Tenstorrent': 'tier_1',
  'PaloAltoNetworks': 'tier_1', 'Sony': 'tier_1', 'Toyota-Research-Institute': 'tier_1',
  'Common-Crawl-Foundation': 'tier_1', 'ibm-ai-platform': 'tier_1', 'DoorDash': 'tier_1',
  'Hugging-Face': 'tier_1', 'Hugging-Face-Smol-Models-Research': 'tier_1', 'Red-Hat-AI': 'tier_1',
  'Hugging-Face-H4': 'tier_1', 'Hugging-Face-Vision-Language-Action-Models-Research': 'tier_1',
  'EMOVA-Hugging-Face': 'tier_1',

  // Tier 2 - Mid-size companies
  'Databricks': 'tier_2', 'Snowflake': 'tier_2', 'GretelAI': 'tier_2', 'Nixtla': 'tier_2',
  'Deci': 'tier_2', 'BRIAAI': 'tier_2', 'Core42': 'tier_2', 'H2O.ai': 'tier_2',
  'Upstage': 'tier_2', 'ZhipuAI': 'tier_2', 'LiquidAI': 'tier_2', 'JinaAI': 'tier_2',
  'Lightricks': 'tier_2', 'LGAIResearch': 'tier_2', 'MiniMax': 'tier_2', 'Perplexity': 'tier_2',
  'StepFun': 'tier_2', 'Z.ai': 'tier_2', 'NariLabs': 'tier_2', 'ArceeAI': 'tier_2',
  'TogetherAI': 'tier_2', 'HuggingFaceM4': 'tier_2', 'ResembleAI': 'tier_2', 'JetBrains': 'tier_2',
  'HyperCLOVA-X': 'tier_2', 'Zyphra': 'tier_2', 'NexaAI': 'tier_2', 'MenloResearch': 'tier_2',
  'ServiceNow-AI': 'tier_2', 'WhiteRabbitNeo': 'tier_2', 'Nanonets': 'tier_2', 'ShopifyAI': 'tier_2',
  'CanopyLabs': 'tier_2', 'JasperAI': 'tier_2', 'DeepCogito': 'tier_2', 'PrimeIntellect': 'tier_2',
  'MayaResearch': 'tier_2', 'Project-Numina': 'tier_2', 'OpenDataLab': 'tier_2', 'LLM360': 'tier_2',
  'fal': 'tier_2', 'CiscoFoundationAI': 'tier_2', 'moondream': 'tier_2', 'UltravoxAI': 'tier_2',
  'Kwaipilot': 'tier_2', 'Writer': 'tier_2', 'Neuphonic': 'tier_2', 'Gradio': 'tier_2',
  'Nexusflow': 'tier_2', 'smolagents': 'tier_2', 'NerdyFace': 'tier_2', 'Latitude': 'tier_2',
  'Freepik': 'tier_2', 'LanguageTechLab-BSC': 'tier_2', 'Gensyn': 'tier_2', 'KakaoCorp': 'tier_2',
  'Mixedbread': 'tier_2', 'PrunaAI': 'tier_2', 'LightOnAI': 'tier_2', 'EssentialAI': 'tier_2',
  'TNG-Consulting': 'tier_2', 'TensorBlock': 'tier_2', 'OpenHands': 'tier_2', 'ELYZA': 'tier_2',
  'KittenML': 'tier_2', 'Nasjonalbiblioteket-AI-Lab': 'tier_2', 'MiroMindAI': 'tier_2',
  'EvolutionaryScale': 'tier_2', 'VIDraft': 'tier_2', 'Finegrain': 'tier_2',
  'GoTo-Gojek-Tokopedia': 'tier_2', 'Elastic': 'tier_2', 'IamCreateAI': 'tier_2',
  'InternRobotics': 'tier_2', 'LlamaIndex': 'tier_2', 'Pollen-Robotics': 'tier_2',
  'Manus-AI': 'tier_2', 'Grammarly': 'tier_2', 'K-Intelligence': 'tier_2', 'Supertone': 'tier_2',
  'Datalab': 'tier_2', 'Argmax': 'tier_2', 'Katanemo': 'tier_2', 'Protect-AI': 'tier_2',
  'Mesolitica': 'tier_2', 'Trelis': 'tier_2', 'Bespoke-Labs': 'tier_2', 'Trillion-Labs': 'tier_2',
  'VAGO-Solutions': 'tier_2', 'KREA': 'tier_2', 'Chai-AI': 'tier_2', 'DecartAI': 'tier_2',
  'Tahoe-Bio': 'tier_2', 'Build-AI': 'tier_2', 'Predibase': 'tier_2', 'Snorkel-AI': 'tier_2',
  'VNGRS': 'tier_2', 'FuriosaAI': 'tier_2', 'Datadog': 'tier_2',
  'Unsloth-AI': 'tier_2', 'Zed-Industries': 'tier_2', 'Unbabel': 'tier_2', 'Reducto': 'tier_2',

  // Tier 3 - Research/Community
  'EleutherAI': 'tier_3', 'TIIUAE': 'tier_3', 'BAAI': 'tier_3', 'BigCode': 'tier_3',
  'OpenBMB': 'tier_3', 'allenai': 'tier_3', 'Ai2': 'tier_3', 'OpenAssistant': 'tier_3',
  'SmolModelsResearch': 'tier_3', 'LeRobot': 'tier_3', 'CohereLabs': 'tier_3',
  'InclusionAI': 'tier_3', 'ShakkerLabs': 'tier_3', 'HiDreamAI': 'tier_3',
  'KuaishouTech': 'tier_3', 'VoyageAI': 'tier_3', 'Timm': 'tier_3', 'MIT': 'tier_3',
  'WangLab': 'tier_3', 'MIMS-Harvard': 'tier_3', 'VanDijkLab': 'tier_3', 'StanfordAIMI': 'tier_3',
  'AnswerDotAI': 'tier_3', 'Idea-CCR': 'tier_3', 'Nexusflow-Research': 'tier_3',
  'LeRobot-Worldwide-Hackathon': 'tier_3', 'Swiss-AI-Initiative': 'tier_3', 'Docling': 'tier_3',
  'HuggingScience': 'tier_3', 'LongCat': 'tier_3', 'KAISAR': 'tier_3', 'Agentica': 'tier_3',
  'Dolphin': 'tier_3', 'Diffusers': 'tier_3', 'AIDC-AI': 'tier_3', 'IBM-NASA-Prithvi': 'tier_3',
  'AgiBotWorld': 'tier_3', 'H-company': 'tier_3', 'Xiaomi-MiMo': 'tier_3', 'LLM-jp': 'tier_3',
  'ArcInstitute': 'tier_3', 'UTTER-XR': 'tier_3', 'ai-sage': 'tier_3', 'TheFinAI': 'tier_3',
  'OpenMOSS': 'tier_3', 'CommonPile': 'tier_3', 'XetTeam': 'tier_3', 'HuggingFace-Sheets': 'tier_3',
  'kernels-community': 'tier_3', 'ESCP': 'tier_3', 'FastVideo': 'tier_3', 'OpenEnv': 'tier_3',
  'wut?': 'tier_3', 'tokyotech-llm': 'tier_3', 'nltpt': 'tier_3', 'gg-hf-gm': 'tier_3',
  'Institute-for-Computer-Science-AI-and-Tech': 'tier_3', 'Institute-of-Smart-Systems-AI': 'tier_3',
  'Future-House': 'tier_3', 'IBM-ESA-Geospatial': 'tier_3', 'Institutional-Data-Initiative': 'tier_3',
  'Athena-Research-Center': 'tier_3', 'LlamaHack': 'tier_3', 'gg-hf': 'tier_3',
  'Apollo-LMMs': 'tier_3', 'Jupyter-Agent': 'tier_3', 'DICTA': 'tier_3', 'NASA-IMPACT': 'tier_3',
  'LibreChat': 'tier_3', 'University-of-Zurich': 'tier_3',
  'LM-Studio-Community': 'tier_3', 'NousResearch': 'tier_3', 'ByteDance-Seed': 'tier_3', 'Open-R1': 'tier_3',
  'Technology-Innovation-Institute': 'tier_3', 'ggml.ai': 'tier_3', 'Kolors-Team,-Kuaishou-Technology': 'tier_3',
  'IBM-NASA-Prithvi-Models-Family': 'tier_3', 'Together': 'tier_3', 'Mohamed-Bin-Zayed-University-of-Artificial-Intelligence': 'tier_3',
  'InstaDeep-Ltd': 'tier_3', 'Language-Technologies-Laboratory-@-Barcelona-Supercomputing-Center': 'tier_3',
  'Roblox-Corporation': 'tier_3', 'Arm': 'tier_3', 'UTTER---Unified-Transcription-and-Translation-for-Extended-Reality': 'tier_3',
  'TNG-Technology-Consulting-GmbH': 'tier_3', 'ELYZA.inc': 'tier_3', 'Ministry-of-Digital-Affairs-of-Poland': 'tier_3',
  'PT-GoTo-Gojek-Tokopedia-Tbk': 'tier_3', 'Institute-for-Computer-Science,-Artificial-intelligence-and-Technology': 'tier_3',
  'Institute-of-Smart-Systems-and-Artificial-Intelligence,-Nazarbayev-University': 'tier_3',
  'Athena-Research-Center-|-Institute-for-Language-and-Speech-Processing': 'tier_3', 'DICTA:-The-Israel-Center-for-Text-Analysis': 'tier_3',
  'VibeStudio': 'tier_3', 'FlyMy.AI': 'tier_3', 'Photoroom': 'tier_3', 'Featherless-Serverless-LLM': 'tier_3', 'Mozilla.ai': 'tier_3',
  'Arcee-Training-Org': 'tier_3', 'LAMM:-MIT-Laboratory-for-Atomistic-and-Molecular-Mechanics': 'tier_3', 'NineNineSix': 'tier_3',
  'Dnotitia-Inc.': 'tier_3', 'SILMA-AI---Arabic-Language-Models': 'tier_3', 'Novita-AI': 'tier_3', 'Lelapa-AI': 'tier_3',
  'MBZUAI-IFM-Paris-Lab': 'tier_3', 'Patronus-AI': 'tier_3', 'Shisa.AI': 'tier_3', 'Vyvo': 'tier_3', 'CAMeL-Lab': 'tier_3',
  'fastino': 'tier_3', 'baseten': 'tier_3', 'MeetKai': 'tier_3', 'LiveKit': 'tier_3', 'TensorStack-AI': 'tier_3',
  'DMind-AI': 'tier_3', 'Fotographer.ai': 'tier_3', 'Axolotl-AI': 'tier_3', 'Useful-Sensors-Inc.': 'tier_3',
  'Stanford-Shah-Lab': 'tier_3', 'Crusoe-AI': 'tier_3', 'Psyche-Foundation': 'tier_3', 'aipicasso': 'tier_3',
  'Intel-Labs': 'tier_3', 'Not-Diamond': 'tier_3', 'WaveSpeedAI': 'tier_3', 'NewMind-AI': 'tier_3', 'Enterprise-Explorers': 'tier_3',
  'PurpleSmartAI,-INC': 'tier_3', 'Epidemic-Sound': 'tier_3', 'Chan-Zuckerberg-Initiative': 'tier_3', 'Lapa-LLM': 'tier_3',
  'SIL-Global---AI': 'tier_3', 'thirdeye-Ai': 'tier_3', 'FriendliAI': 'tier_3', 'allganize': 'tier_3', 'Masterclass': 'tier_3',
  'AskUI': 'tier_3', 'DatologyAI': 'tier_3', 'Project-Aria-from-Meta-Reality-Labs-Research': 'tier_3', 'GovTech---AI-Practice': 'tier_3',
  'Modular,-Inc.': 'tier_3', 'Stockmark-Inc.': 'tier_3', 'Eka-Care': 'tier_3', 'Aleph-Alpha-Research': 'tier_3',
  'Collinear-AI': 'tier_3', 'MacPaw-Way-Ltd.': 'tier_3', 'Remyx-AI': 'tier_3', 'CGIAR': 'tier_3', 'Synaptics': 'tier_3',
  'TechWolf': 'tier_3', 'HorizonRobotics': 'tier_3', 'Vespa.ai': 'tier_3', 'Prem': 'tier_3', 'DRAGON-LLM': 'tier_3',
  'Synthyra': 'tier_3', 'Diffbot': 'tier_3', 'Elyn-AI': 'tier_3', 'ByteShape': 'tier_3', 'Resaro': 'tier_3',
  'Cantina,-Inc.': 'tier_3', '1X': 'tier_3', 'Raspberry-AI': 'tier_3', 'Runware': 'tier_3', 'Miðeind-ehf.': 'tier_3',
  'SaruLab-Speech-group': 'tier_3', 'Martian': 'tier_3', 'AngelSlim': 'tier_3', 'AIdeaLab': 'tier_3', 'sionic-ai': 'tier_3',
  'Mímir-Project': 'tier_3', 'ZeroAgency': 'tier_3', 'Tzafon-inc': 'tier_3', 'Deepwin': 'tier_3',
  'Language-Technologies,-Bangor-University': 'tier_3', 'KissanAI': 'tier_3', 'Qualifire-AI': 'tier_3', 'FlagRelease': 'tier_3',
  'Ubitus-K.-K.': 'tier_3', 'Gigax': 'tier_3', 'AgentSea': 'tier_3', 'AI71': 'tier_3', 'SAFE-Challenge': 'tier_3',
  'Fortytwo': 'tier_3', 'Consensus': 'tier_3', 'drc-8': 'tier_3', 'QVAC': 'tier_3', 'ellamind': 'tier_3',
  'diffusers-internal-dev': 'tier_3', 'xMAD.ai': 'tier_3', 'empathy.ai': 'tier_3', 'thestage.ai': 'tier_3', 'Haize-Labs': 'tier_3',
  'Naseej': 'tier_3', 'Northell-Partners': 'tier_3', 'ThinkOnward': 'tier_3', 'General-Agents': 'tier_3', 'Parasail': 'tier_3',
  'Atomic-Canyon': 'tier_3', 'Yala-Lab': 'tier_3', 'ROBOTIS': 'tier_3', 'Clarifai': 'tier_3', 'Kenpath-Technologies': 'tier_3',
  'Acuvity-Inc': 'tier_3', 'Amini': 'tier_3', 'altai.dev': 'tier_3', 'legml.ai': 'tier_3', 'Palisade-Research': 'tier_3',
  'Diffusion-CoT': 'tier_3', 'The-AI-Institute': 'tier_3', 'Adalat-AI': 'tier_3', 'Polaris-Lab-(Princeton)': 'tier_3',
  'covenant': 'tier_3', 'KRNL': 'tier_3', 'Enkrypt-AI': 'tier_3', 'Raw-Power-Labs': 'tier_3', 'VLABench': 'tier_3',
  'identity-ai-labs': 'tier_3', 'AI-Squared,-Inc.': 'tier_3', 'AUGMXNT': 'tier_3', 'DATUMO': 'tier_3', 'AIM-Intelligence': 'tier_3',
  'Dedalus-HealthCare-GmbH': 'tier_3', 'PraxySanté': 'tier_3', 'Sparticle': 'tier_3', 'Zero-Systems': 'tier_3', 'Corto': 'tier_3',
  'Algorithmic-Research-Group': 'tier_3', 'Zentropi': 'tier_3', 'Pieces': 'tier_3', 'Minion-AI': 'tier_3',
  'SketchPro-Technologies,-Inc.': 'tier_3', 'DebateLab-at-KIT': 'tier_3', 'DeepKeep': 'tier_3',
  'Black-Hills-Information-Security': 'tier_3', 'Virtuos-rnd': 'tier_3', 'Deep-Infra-Inc.': 'tier_3', 'Inect': 'tier_3',
  'Synthetic-Lab': 'tier_3', 'Mirai': 'tier_3', 'CTW': 'tier_3', 'LoveScapeAI': 'tier_3', 'Chutes': 'tier_3', 'eh-quizz': 'tier_3',
  'TOE': 'tier_3', 'BRICKS': 'tier_3', 'Locai-Labs': 'tier_3', 'Qwerky-AI': 'tier_3', 'Bylaw': 'tier_3', 'Superapp-Labs': 'tier_3',
  'QA.tech': 'tier_3', 'Tensorlake-Inc': 'tier_3', 'Embedl': 'tier_3', 'Logiroad': 'tier_3', 'BioAge-Labs': 'tier_3',
  'Cirrascale-Cloud-Services': 'tier_3', 'Alpha-Singularity': 'tier_3', 'Allegro-Lab-@-USC': 'tier_3',
  'MOGAM-(Institute-for-Biomedical-Research)': 'tier_3', 'Infosys-Enterprise': 'tier_3', 'RapidFire-AI,-Inc.': 'tier_3',
  'PublicaAI': 'tier_3', 'Dropbox-Inc': 'tier_3', 'Tennr': 'tier_3', 'Acellera': 'tier_3', 'HelloBible': 'tier_3', '42-Labs': 'tier_3',
  'Call-Center-Studio': 'tier_3', 'KMC-Solutions': 'tier_3', 'Bynesoft-Ltd.': 'tier_3', 'DeepAuto.ai': 'tier_3', 'Numind-dev': 'tier_3',
  'AGI-Inc': 'tier_3', 'OnlyThings': 'tier_3', 'Charles-Elena': 'tier_3', 'ReadyAI': 'tier_3', 'Relace-Team': 'tier_3',
  'Arc-Intelligence': 'tier_3', 'Straker-Ltd': 'tier_3', 'Khoj-Inc.': 'tier_3', 'Growth-Cadet': 'tier_3',
  'Cosmonauts-&-Kings': 'tier_3', 'Aumo-S/A': 'tier_3', 'Cribl,-Inc.': 'tier_3', 'Sailplane': 'tier_3', 'daisy': 'tier_3',
  'ConfidentialMind': 'tier_3', 'Katara': 'tier_3', 'Icosa-Computing': 'tier_3', 'Ito': 'tier_3', 'Gizmo': 'tier_3',
  'BoldVoice': 'tier_3', 'Axur': 'tier_3', 'TMFI-Consulting': 'tier_3', 'Tiime': 'tier_3', 'Tangering-AI': 'tier_3',
  'Commotion': 'tier_3', 'Nosible-Ltd': 'tier_3', 'esa-sceva': 'tier_3', 'fusionbase': 'tier_3', 'MediaCatch': 'tier_3'
};

function getTierForPublisher(publisher) {
  if (!publisher) return null;
  // Direct lookup
  if (PUBLISHER_TIER_MAP[publisher]) {
    return PUBLISHER_TIER_MAP[publisher];
  }
  // Case-insensitive fallback
  const pubLower = publisher.toLowerCase();
  for (const [key, tier] of Object.entries(PUBLISHER_TIER_MAP)) {
    if (key.toLowerCase() === pubLower) {
      return tier;
    }
  }
  return null; // Unknown publisher
}

/* ---------- Category classification from pipeline_tag ---------- */
function categorizePipelineTag(pipelineTag) {
  if (!pipelineTag) return 'LLM'; // Default

  const tag = pipelineTag.toLowerCase();

  // Text/LLM tasks
  if (tag.includes('text-generation') || tag.includes('text2text') || tag.includes('conversational') ||
      tag.includes('fill-mask') || tag.includes('question-answering') || tag.includes('summarization') ||
      tag.includes('translation') || tag.includes('token-classification') || tag.includes('text-classification')) {
    return 'LLM';
  }

  // Image tasks
  if (tag.includes('image') || tag.includes('vision') || tag.includes('object-detection') ||
      tag.includes('image-classification') || tag.includes('image-segmentation') || tag.includes('depth-estimation')) {
    return 'Vision';
  }

  // Audio tasks
  if (tag.includes('audio') || tag.includes('speech') || tag.includes('voice') ||
      tag.includes('automatic-speech-recognition') || tag.includes('audio-classification') || tag.includes('text-to-speech')) {
    return 'Audio';
  }

  // Video tasks
  if (tag.includes('video')) {
    return 'Video';
  }

  // Code tasks
  if (tag.includes('code')) {
    return 'Code';
  }

  // Embedding/Feature extraction
  if (tag.includes('feature-extraction') || tag.includes('sentence-similarity') || tag.includes('embedding')) {
    return 'Embedding';
  }

  // Multimodal
  if (tag.includes('multimodal') || tag.includes('visual-question-answering') || tag.includes('document-question-answering')) {
    return 'Multimodal';
  }

  // Reinforcement Learning
  if (tag.includes('reinforcement-learning') || tag.includes('robotics')) {
    return 'Reinforcement Learning';
  }

  return 'LLM'; // Default fallback
}

/* ---------- Access type classification ---------- */
// access_type is now set to the platform(s) the model is available on
// This is stored as an array in the same format as available_on field

async function fetchWithRetry(url, opts = {}, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, opts);
      if (!res.ok) {
        if (res.status === 429 || res.status === 503) {
          // More aggressive exponential backoff for rate limits
          const delay = 3000 * Math.pow(2, i); // Start with 3 seconds, doubles each retry
          console.log(`  ⏳ Rate limited (${res.status}), waiting ${(delay/1000).toFixed(1)}s... (retry ${i+1}/${retries})`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        if (res.status === 404) {
          return null; // Not found
        }
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      const delay = 1000 * (i + 1);
      console.log(`  ⚠️  Request failed, retrying in ${delay/1000}s...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('fetch failed');
}

/* ---------- Concurrency limiter (small internal implementation) ---------- */
async function limitConcurrency(items, workerFn, concurrency = 6) {
  const out = new Array(items.length);
  let idx = 0;
  const runners = new Array(concurrency).fill(null).map(async () => {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      try {
        out[i] = await workerFn(items[i], i);
      } catch (err) {
        out[i] = { error: String(err) };
      }
    }
  });
  await Promise.all(runners);
  return out;
}

/* ---------- Enrichment: fetch per-model metadata (NO README) ---------- */
async function enrichHfModel(m) {
  try {
    const modelId = m.model_id || m.huggingface_id || m.name;
    if (!modelId) return m;

    // Encode path segments (owner and repo) but preserve '/'
    const encodedPath = modelId.split('/').map(encodeURIComponent).join('/');

    // Full model info endpoint (use encodedPath)
    const infoUrl = `https://huggingface.co/api/models/${encodedPath}`;
    const infoRes = await fetchWithRetry(infoUrl, {
      headers: {
        Authorization: HF_API_KEY ? `Bearer ${HF_API_KEY}` : undefined,
        'User-Agent': 'ModelCollector/1.0'
      }
    }, 3);

    if (infoRes) {
      if (!infoRes.ok) {
        const txt = await infoRes.text().catch(() => '<no-body>');
        console.error(`  ❌ HF info for ${modelId} returned ${infoRes.status}: ${txt}`);
      } else {
        const info = await infoRes.json();
        m.downloads = info.downloads ?? m.downloads ?? 0;
        m.likes = info.likes ?? m.likes ?? 0;
        m.pipeline_tag = info.pipeline_tag || m.pipeline_tag || null;
        if (info.pipeline_tag) m.task = m.task && m.task.length ? m.task : [info.pipeline_tag];
        if (info.tags && (!m.tags || m.tags.length === 0)) m.tags = info.tags;
        if (info.cardData) {
          m.short_description = m.short_description || info.cardData.short_description || null;
          m.description = m.description || info.cardData.description || null;
        }
        m.license = info.license || m.license || null;
        m.huggingface_id = m.huggingface_id || info.id || modelId;
        m.last_modified = m.last_modified || info.lastModified || info.updated_at || m.last_modified;
        m.created_timestamp = m.created_timestamp || info.createdAt || info.created_at || m.created_timestamp;

        // Fallback description if short_description is missing
        if (!m.short_description && m.description) {
          m.short_description = m.description.slice(0, 200) + (m.description.length > 200 ? '...' : '');
        }
        if (!m.short_description) {
          m.short_description = `${m.pipeline_tag || 'AI'} model by ${m.publisher}`;
        }
      }
    }
  } catch (err) {
    console.error(`  ⚠️  Enrich failed for ${m.model_id || m.name}: ${err.message}`);
  } finally {
    // Ensure canonical id reflects newly set huggingface_id if present
    m.canonical_model_id = computeCanonicalId(m);
    return m;
  }
}

/* ---------- Hugging Face listing (now enriches each page of results) ---------- */
async function fetchHfModelsForOrg(org, maxPages = 20) {
  console.log(`\n📦 Fetching ${org}...`);
  const models = [];

  // Smart case variations that preserve internal capitals AND handle special chars
  const generateCaseVariations = (str) => {
    const variations = [
      str,
      str.toLowerCase(),
      str.toUpperCase(),
    ];
    const withoutSpecialChars = str.replace(/[.-]/g, '');
    if (withoutSpecialChars !== str) {
      variations.push(withoutSpecialChars, withoutSpecialChars.toLowerCase(), withoutSpecialChars.toUpperCase());
    }
    const hasInternalCaps = /[a-z][A-Z]/.test(str);
    if (!hasInternalCaps) {
      variations.push(str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
      if (withoutSpecialChars !== str) {
        variations.push(withoutSpecialChars.charAt(0).toUpperCase() + withoutSpecialChars.slice(1).toLowerCase());
      }
    }
    return [...new Set(variations)];
  };

  const orgsToTry = generateCaseVariations(org);
  let successfulOrg = null;

  for (const tryOrg of orgsToTry) {
    const testUrl = `https://huggingface.co/api/models?author=${encodeURIComponent(tryOrg)}&limit=1&full=true`;
    try {
      const testRes = await fetchWithRetry(testUrl, {
        headers: {
          Authorization: HF_API_KEY ? `Bearer ${HF_API_KEY}` : undefined,
          'User-Agent': 'ModelCollector/1.0'
        }
      });
      if (testRes) {
        const testData = await testRes.json();
        if (Array.isArray(testData) && testData.length > 0) {
          successfulOrg = tryOrg;
          if (tryOrg !== org) {
            console.log(`  ℹ️  Using: ${tryOrg} (instead of ${org})`);
          }
          break;
        }
      }
    } catch (e) {
      continue;
    }
  }

  if (!successfulOrg) {
    console.log(`  ⚠️  Organization not found (tried: ${orgsToTry.join(', ')})`);
    return models;
  }

  for (let page = 0; page < maxPages; page++) {
    const url = `https://huggingface.co/api/models?author=${encodeURIComponent(successfulOrg)}&limit=${HF_PAGE_LIMIT}&skip=${page * HF_PAGE_LIMIT}&full=true`;
    try {
      const res = await fetchWithRetry(url, {
        headers: {
          Authorization: HF_API_KEY ? `Bearer ${HF_API_KEY}` : undefined,
          'User-Agent': 'ModelCollector/1.0'
        }
      });

      if (!res) break;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;

      // Build pageModels then enrich them concurrently but limited
      const pageModels = [];
      for (const m of data) {
        if (m.id && (m.id.includes('lora') || m.id.includes('adapter'))) continue;

        const card = m.cardData || {};
        const pipelineTag = m.pipeline_tag || card.pipeline_tag || null;

        // Fallback: If no pipeline_tag, check tags array for task hints
        let inferredPipelineTag = pipelineTag;
        if (!pipelineTag && m.tags && Array.isArray(m.tags)) {
          const taskTags = m.tags.filter(tag =>
            tag.includes('generation') || tag.includes('classification') ||
            tag.includes('detection') || tag.includes('recognition') ||
            tag.includes('segmentation') || tag.includes('embedding')
          );
          if (taskTags.length > 0) inferredPipelineTag = taskTags[0];
        }

        const modelObj = {
          name: (m.id && m.id.split('/')[1]) || m.id,
          model_id: m.id,
          huggingface_id: m.id,
          publisher: successfulOrg,
          publisher_image: getPublisherImage(successfulOrg) || getPublisherImage(org),
          category: categorizePipelineTag(inferredPipelineTag),
          pipeline_tag: pipelineTag,
          task: pipelineTag ? [pipelineTag] : [],
          tags: m.tags || [],
          downloads: m.downloads || 0,
          likes: m.likes || 0,
          short_description: card.short_description || null,
          description: card.description || null,
          huggingface_url: `https://huggingface.co/${m.id}`,
          source: 'huggingface',
          created_timestamp: m.createdAt || null,
          last_modified: m.lastModified || null,
        };

        // Add tier and access_type (platform availability)
        modelObj.tier = getTierForPublisher(successfulOrg);
        modelObj.access_type = [modelObj.source]; // Initially just the source, will be merged later
        modelObj.canonical_model_id = computeCanonicalId(modelObj);
        pageModels.push(modelObj);
      }

      // Add models directly without enrichment (to avoid rate limiting)
      if (pageModels.length > 0) {
        for (const model of pageModels) {
          // Add fallback description if missing
          if (!model.short_description && model.description) {
            model.short_description = model.description.slice(0, 200) + (model.description.length > 200 ? '...' : '');
          }
          if (!model.short_description) {
            model.short_description = `${model.pipeline_tag || 'AI'} model by ${model.publisher}`;
          }
          models.push(model);
        }
        process.stdout.write(`\r  📄 Page ${page + 1}: ${models.length} models`);
      }

      if (data.length < HF_PAGE_LIMIT) break;
      await new Promise(r => setTimeout(r, 2000)); // increased delay between pages to avoid rate limits
    } catch (err) {
      console.error(`\n  ❌ Error: ${err.message}`);
      break;
    }
  }

  console.log(`\n  ✅ Total: ${models.length} models`);
  return models;
}

/* ---------- OpenRouter ---------- */
async function fetchOpenRouterModels() {
  console.log('\n🌐 Fetching OpenRouter models...');
  try {
    const res = await fetchWithRetry('https://openrouter.ai/api/v1/models', {
      headers: OPENROUTER_API_KEY ? { Authorization: `Bearer ${OPENROUTER_API_KEY}` } : {}
    });

    if (!res) return [];

    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) {
      console.log('  ⚠️  Unexpected format');
      return [];
    }

    const models = data.data.map(m => {
      const parts = (m.id || '').split('/');
      const publisher = parts.length >= 2 ? parts[0] : 'openrouter';
      const name = parts.length >= 2 ? parts.slice(1).join('/') : m.id;

      const modelObj = {
        name,
        model_id: m.id,
        openrouter_id: m.id,
        publisher,
        publisher_image: getPublisherImage(publisher),
        category: 'LLM',
        task: m.architecture?.modality ? [m.architecture.modality] : [],
        tags: m.tags || [],
        short_description: m.description || null,
        openrouter_url: `https://openrouter.ai/models/${m.id}`,
        pricing: m.pricing || null,
        source: 'openrouter',
      };

      // Add tier and access_type (platform availability)
      modelObj.tier = getTierForPublisher(publisher);
      modelObj.access_type = [modelObj.source]; // Initially just the source, will be merged later
      modelObj.canonical_model_id = computeCanonicalId(modelObj);
      return modelObj;
    });

    console.log(`  ✅ Fetched ${models.length} models`);
    return models;
  } catch (err) {
    console.error(`  ❌ Error: ${err.message}`);
    return [];
  }
}

/* ---------- Ollama (scrape) ---------- */
async function fetchOllamaModels() {
  console.log('\n🦙 Fetching Ollama models...');

  try {
    const res = await fetchWithRetry('https://ollama.com/library');
    if (!res) {
      console.log('  ⚠️  Failed to fetch Ollama library page');
      return [];
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const models = [];

    $('li').each((i, elem) => {
      const $elem = $(elem);
      const name = $elem.find('h2, .font-medium').first().text().trim();
      const description = $elem.find('p').first().text().trim();
      const href = $elem.find('a').attr('href');

      if (name && name.length < 50 && name.length > 0) {
        const nameLower = name.toLowerCase();

        let publisher = 'ollama';
        if (nameLower.includes('llama') || nameLower.includes('codellama')) publisher = 'meta-llama';
        else if (nameLower.includes('mistral') || nameLower.includes('mixtral')) publisher = 'mistralai';
        else if (nameLower.includes('gemma')) publisher = 'google';
        else if (nameLower.includes('phi')) publisher = 'microsoft';
        else if (nameLower.includes('deepseek')) publisher = 'deepseek-ai';
        else if (nameLower.includes('qwen')) publisher = 'qwen';
        else if (nameLower.includes('vicuna')) publisher = 'lmsys';
        else if (nameLower.includes('starcoder')) publisher = 'bigcode';
        else if (nameLower.includes('falcon')) publisher = 'tiiuae';
        else if (nameLower.includes('stable')) publisher = 'stabilityai';
        else if (nameLower.includes('command')) publisher = 'cohere';
        else if (nameLower.includes('yi')) publisher = '01-ai';

        const modelObj = {
          name,
          model_id: `${publisher}/${name.replace(/\s+/g, '-').toLowerCase()}`,
          publisher,
          publisher_image: getPublisherImage(publisher),
          category: 'LLM',
          short_description: description || 'Local Ollama model',
          description: description || null,
          ollama_url: href ? `https://ollama.com${href}` : `https://ollama.com/library/${name}`,
          source: 'ollama',
        };

        // Add tier and access_type (platform availability)
        modelObj.tier = getTierForPublisher(publisher);
        modelObj.access_type = [modelObj.source]; // Initially just the source, will be merged later
        modelObj.canonical_model_id = computeCanonicalId(modelObj);
        models.push(modelObj);
      }
    });

    console.log(`  ✅ Fetched ${models.length} models`);
    return models;
  } catch (err) {
    console.error(`  ❌ Error: ${err.message}`);
    return [];
  }
}

/* ---------- CSV saver ---------- */
function saveToCSV(models, filename) {
  const headers = [
    'name', 'model_id', 'canonical_model_id', 'publisher', 'category',
    'source', 'huggingface_id', 'openrouter_id', 'downloads', 'likes',
    'short_description', 'huggingface_url', 'openrouter_url', 'ollama_url', 'tags', 'tier', 'access_type'
  ];

  let csv = headers.join(',') + '\n';

  for (const m of models) {
    const row = headers.map(h => {
      let val = m[h];
      if (Array.isArray(val)) val = val.join(';');
      if (val === null || val === undefined) val = '';
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    });
    csv += row.join(',') + '\n';
  }

  fs.writeFileSync(filename, csv);
  console.log(`\n💾 Saved ${models.length} models to ${filename}`);
}

/* ---------- Model merging across sources ---------- */
function mergeModels(allModels) {
  console.log('\n🔀 Merging models across sources...');
  const merged = new Map();

  for (const model of allModels) {
    // Use canonical_model_id for matching
    const canonicalId = model.canonical_model_id;

    if (merged.has(canonicalId)) {
      // Merge with existing model
      const existing = merged.get(canonicalId);

      // Add source to available_on if not already there
      if (!existing.available_on.includes(model.source)) {
        existing.available_on.push(model.source);
      }

      // Merge links
      if (model.huggingface_url) existing.links.huggingface = model.huggingface_url;
      if (model.ollama_url) existing.links.ollama = model.ollama_url;
      if (model.openrouter_url) existing.links.openrouter = model.openrouter_url;

      // Merge IDs
      if (model.huggingface_id) existing.huggingface_id = model.huggingface_id;
      if (model.openrouter_id) existing.openrouter_id = model.openrouter_id;

      // Keep highest download/like counts
      existing.downloads = Math.max(existing.downloads || 0, model.downloads || 0);
      existing.likes = Math.max(existing.likes || 0, model.likes || 0);

      // Prefer non-null descriptions
      if (!existing.short_description && model.short_description) {
        existing.short_description = model.short_description;
      }
      if (!existing.description && model.description) {
        existing.description = model.description;
      }

      // Merge tags (unique)
      if (model.tags && model.tags.length > 0) {
        existing.tags = [...new Set([...existing.tags, ...model.tags])];
      }

      // Merge access_type arrays (platforms where the model is available)
      if (model.access_type && Array.isArray(model.access_type)) {
        existing.access_type = [...new Set([...existing.access_type, ...model.access_type])];
      }
    } else {
      // First occurrence of this model
      merged.set(canonicalId, {
        ...model,
        available_on: [model.source],
        links: {
          ...(model.huggingface_url && { huggingface: model.huggingface_url }),
          ...(model.ollama_url && { ollama: model.ollama_url }),
          ...(model.openrouter_url && { openrouter: model.openrouter_url }),
        }
      });
    }
  }

  const mergedArray = Array.from(merged.values());
  console.log(`  ✅ Merged ${allModels.length} models into ${mergedArray.length} unique models`);
  return mergedArray;
}

/* ---------- Supabase upload to models_catalog ---------- */
async function uploadToSupabase(models) {
  console.log('\n📤 Uploading to Supabase models_catalog...');

  const records = models.map(m => ({
    canonical_model_id: m.canonical_model_id || `fallback-${Date.now()}-${Math.random()}`,
    model_id: m.model_id || m.canonical_model_id || 'unknown',
    name: m.name || 'Unknown Model',
    publisher: m.publisher || 'Unknown',
    publisher_image: m.publisher_image || null,
    tier: m.tier || null,
    access_type: m.access_type || [m.source] || ['unknown'],
    category: m.category || 'LLM',
    pipeline_tag: m.pipeline_tag || null,
    source: m.source || 'unknown',
    available_on: m.available_on || [m.source],
    links: m.links || {},
    short_description: m.short_description || null,
    description: m.description || null,
    tags: m.tags || [],
    task: m.task || [],
    downloads: m.downloads ?? 0,
    likes: m.likes ?? 0,
    license: m.license || null,
    huggingface_id: m.huggingface_id || null,
    openrouter_id: m.openrouter_id || null,
    last_modified: m.last_modified || null,
  }));

  const batchSize = 100;
  let uploaded = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    // Use canonical_model_id as conflict key since it has UNIQUE constraint
    const { error } = await supabase
      .from('models_catalog')
      .upsert(batch, { onConflict: 'canonical_model_id' });

    if (error) {
      console.error(`  ❌ Batch ${i / batchSize + 1}: ${error.message}`);
    } else {
      uploaded += batch.length;
      process.stdout.write(`\r  ⬆️  Progress: ${uploaded}/${records.length}`);
    }
  }

  console.log(`\n  ✅ Uploaded ${uploaded} models`);
}

/* ---------- Main processing flow ---------- */
async function processOrgs(orgList, sessionName, includeOllama = true) {
  console.log(`\n🚀 Processing ${orgList.length} organizations...`);
  console.log(`📊 Session: ${sessionName}\n`);

  const allModels = [];
  const startTime = Date.now();
  const notFoundOrgs = [];

  // Process HuggingFace orgs
  for (let i = 0; i < orgList.length; i++) {
    console.log(`[${i + 1}/${orgList.length}]`);
    const models = await fetchHfModelsForOrg(orgList[i]);
    if (models.length === 0) {
      notFoundOrgs.push(orgList[i]);
    }
    allModels.push(...models);
  }

  // Fetch OpenRouter once
  const orModels = await fetchOpenRouterModels();
  allModels.push(...orModels);

  // Fetch Ollama (only once per session)
  if (includeOllama && (sessionName === 'tier1' || sessionName === 'all')) {
    const ollamaModels = await fetchOllamaModels();
    allModels.push(...ollamaModels);
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n⏱️  Completed in ${duration} minutes`);
  console.log(`📊 Total models collected: ${allModels.length}\n`);

  // Print organizations not found
  if (notFoundOrgs.length > 0) {
    console.log(`\n⚠️  Organizations not found (${notFoundOrgs.length}):`);
    notFoundOrgs.forEach(org => console.log(`   - ${org}`));
    console.log('');
  }

  // Merge models across sources (deduplication)
  const mergedModels = mergeModels(allModels);

  const filename = `models_${sessionName}_${Date.now()}.csv`;
  saveToCSV(mergedModels, filename);
  await uploadToSupabase(mergedModels);

  return { models: mergedModels, filename };
}

/* ---------- CLI / main ---------- */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
📚 AI Model Collector

Usage:
  node collector.js --all              # All organizations (takes ~2-3 hours)
  node collector.js --tier1            # Tier 1 only (35 orgs) + OpenRouter + Ollama
  node collector.js --tier2            # Tier 2 only (62 orgs) + OpenRouter
  node collector.js --tier3            # Tier 3 only (37 orgs) + OpenRouter
  node collector.js org1,org2,org3     # Specific organizations

Examples:
  node collector.js --tier1
  node collector.js meta-llama,google,mistralai
  node collector.js --all
    `);
    return;
  }

  let orgsToProcess = [];
  let sessionName = 'custom';

  if (args[0] === '--all') {
    orgsToProcess = [...ALL_ORGS.tier_1, ...ALL_ORGS.tier_2, ...ALL_ORGS.tier_3];
    sessionName = 'all';
  } else if (args[0] === '--tier1') {
    orgsToProcess = ALL_ORGS.tier_1;
    sessionName = 'tier1';
  } else if (args[0] === '--tier2') {
    orgsToProcess = ALL_ORGS.tier_2;
    sessionName = 'tier2';
  } else if (args[0] === '--tier3') {
    orgsToProcess = ALL_ORGS.tier_3;
    sessionName = 'tier3';
  } else {
    orgsToProcess = args[0].split(',').map(s => s.trim());
    sessionName = 'custom';
  }

  console.log('═'.repeat(50));
  console.log('  🤖 AI Model Collector v2.0 (README + metadata enrichment)');
  console.log('═'.repeat(50));

  await processOrgs(orgsToProcess, sessionName);

  console.log('\n✨ Done! Check your CSV file and Supabase database.\n');
}

main().catch(console.error);
