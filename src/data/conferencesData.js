/**
 * AI & ML Conferences Data
 * 
 * Organized by domain with tier rankings (A*, A, B)
 * Updated: December 2024
 */

export const conferenceDomains = [
  {
    id: "ml",
    title: "Machine Learning (General)",
    description: "Core ML, deep learning, theory and optimization.",
    conferences: [
      {
        id: "neurips",
        name: "NeurIPS",
        tier: "A* Tier",
        domainTag: "ML · DL · RL",
        subtitle: "Conference on Neural Information Processing Systems - flagship venue for ML research.",
        frequency: "Annual",
        usualMonth: "December",
        badgeChip: "Highly selective",
        url: "https://neurips.cc"
      },
      {
        id: "icml",
        name: "ICML",
        tier: "A* Tier",
        domainTag: "ML · Theory",
        subtitle: "International Conference on Machine Learning - premier ML research conference.",
        frequency: "Annual",
        usualMonth: "July",
        badgeChip: "Top ML venue",
        url: "https://icml.cc"
      },
      {
        id: "iclr",
        name: "ICLR",
        tier: "A* Tier",
        domainTag: "DL · Representation",
        subtitle: "International Conference on Learning Representations - focus on deep learning.",
        frequency: "Annual",
        usualMonth: "April / May",
        badgeChip: "Growing prestige",
        url: "https://iclr.cc"
      },
      {
        id: "aistats",
        name: "AISTATS",
        tier: "A Tier",
        domainTag: "ML · Statistics",
        subtitle: "International Conference on Artificial Intelligence and Statistics.",
        frequency: "Annual",
        usualMonth: "March / April",
        badgeChip: "Theory-focused",
        url: "https://aistats.org"
      },
      {
        id: "uai",
        name: "UAI",
        tier: "A Tier",
        domainTag: "ML · Uncertainty",
        subtitle: "Conference on Uncertainty in Artificial Intelligence.",
        frequency: "Annual",
        usualMonth: "August",
        badgeChip: "Probabilistic AI",
        url: "https://www.auai.org"
      },
      {
        id: "colt",
        name: "COLT",
        tier: "A Tier",
        domainTag: "Learning Theory",
        subtitle: "Conference on Learning Theory - theoretical foundations of machine learning.",
        frequency: "Annual",
        usualMonth: "June / July",
        badgeChip: "Theory emphasis",
        url: "https://learningtheory.org"
      },
      {
        id: "alt",
        name: "ALT",
        tier: "B Tier",
        domainTag: "Algorithmic Learning",
        subtitle: "International Conference on Algorithmic Learning Theory.",
        frequency: "Annual",
        usualMonth: "March",
        badgeChip: "Theoretical focus",
        url: "https://alt-conference.org"
      }
    ]
  },
  {
    id: "nlp",
    title: "Natural Language Processing (NLP)",
    description: "Language models, LLMs, translation and dialogue systems.",
    conferences: [
      {
        id: "acl",
        name: "ACL",
        tier: "A* Tier",
        domainTag: "NLP · LLMs",
        subtitle: "Annual Meeting of the Association for Computational Linguistics.",
        frequency: "Annual",
        usualMonth: "July",
        badgeChip: "Premier NLP venue",
        url: "https://www.aclweb.org"
      },
      {
        id: "emnlp",
        name: "EMNLP",
        tier: "A* Tier",
        domainTag: "NLP · Empirical",
        subtitle: "Conference on Empirical Methods in Natural Language Processing.",
        frequency: "Annual",
        usualMonth: "November / December",
        badgeChip: "Applied NLP",
        url: "https://2024.emnlp.org"
      },
      {
        id: "naacl",
        name: "NAACL",
        tier: "A Tier",
        domainTag: "NLP · North America",
        subtitle: "North American Chapter of the Association for Computational Linguistics.",
        frequency: "Annual",
        usualMonth: "June",
        badgeChip: "Regional focus",
        url: "https://2024.naacl.org"
      },
      {
        id: "eacl",
        name: "EACL",
        tier: "A Tier",
        domainTag: "NLP · European",
        subtitle: "European Chapter of the Association for Computational Linguistics.",
        frequency: "Annual",
        usualMonth: "April / May",
        badgeChip: "European NLP",
        url: "https://2024.eacl.org"
      },
      {
        id: "coling",
        name: "COLING",
        tier: "A Tier",
        domainTag: "NLP · Linguistics",
        subtitle: "International Conference on Computational Linguistics.",
        frequency: "Biennial",
        usualMonth: "Varies",
        badgeChip: "Linguistic depth",
        url: "https://coling2025.org"
      },
      {
        id: "conll",
        name: "CoNLL",
        tier: "A Tier",
        domainTag: "NLP · Learning",
        subtitle: "Conference on Computational Natural Language Learning.",
        frequency: "Annual",
        usualMonth: "November",
        badgeChip: "Learning focus",
        url: "https://conll.org"
      }
    ]
  },
  {
    id: "cv",
    title: "Computer Vision (CV)",
    description: "Vision, object detection, segmentation and multimodal models.",
    conferences: [
      {
        id: "cvpr",
        name: "CVPR",
        tier: "A* Tier",
        domainTag: "Vision · Recognition",
        subtitle: "Computer Vision and Pattern Recognition - top CV conference.",
        frequency: "Annual",
        usualMonth: "June",
        badgeChip: "Industry-heavy",
        url: "https://cvpr.thecvf.com"
      },
      {
        id: "iccv",
        name: "ICCV",
        tier: "A* Tier",
        domainTag: "Vision · Theory",
        subtitle: "International Conference on Computer Vision.",
        frequency: "Biennial",
        usualMonth: "October",
        badgeChip: "Highly selective",
        url: "https://iccv2025.thecvf.com"
      },
      {
        id: "eccv",
        name: "ECCV",
        tier: "A* Tier",
        domainTag: "Vision · European",
        subtitle: "European Conference on Computer Vision.",
        frequency: "Biennial",
        usualMonth: "September",
        badgeChip: "European focus",
        url: "https://eccv.org"
      },
      {
        id: "wacv",
        name: "WACV",
        tier: "A Tier",
        domainTag: "Vision · Applications",
        subtitle: "Winter Conference on Applications of Computer Vision.",
        frequency: "Annual",
        usualMonth: "January / February",
        badgeChip: "Application focus",
        url: "https://wacv2025.thecvf.com"
      },
      {
        id: "accv",
        name: "ACCV",
        tier: "A Tier",
        domainTag: "Vision · Asian",
        subtitle: "Asian Conference on Computer Vision.",
        frequency: "Biennial",
        usualMonth: "December",
        badgeChip: "Asian region",
        url: "https://accv2024.org"
      },
      {
        id: "bmvc",
        name: "BMVC",
        tier: "A Tier",
        domainTag: "Vision · British",
        subtitle: "British Machine Vision Conference.",
        frequency: "Annual",
        usualMonth: "November",
        badgeChip: "Accessible venue",
        url: "https://bmvc2024.org"
      },
      {
        id: "3dv",
        name: "3DV",
        tier: "B Tier",
        domainTag: "3D Vision",
        subtitle: "International Conference on 3D Vision.",
        frequency: "Annual",
        usualMonth: "March",
        badgeChip: "3D specialized",
        url: "https://3dvconf.github.io"
      }
    ]
  },
  {
    id: "robotics",
    title: "Robotics & RL",
    description: "Robot learning, control, planning and reinforcement learning.",
    conferences: [
      {
        id: "icra",
        name: "ICRA",
        tier: "A* Tier",
        domainTag: "Robotics · RL",
        subtitle: "International Conference on Robotics and Automation.",
        frequency: "Annual",
        usualMonth: "May",
        badgeChip: "Premier robotics",
        url: "https://www.ieee-ras.org/conferences-workshops/fully-sponsored/icra"
      },
      {
        id: "iros",
        name: "IROS",
        tier: "A* Tier",
        domainTag: "Robotics · Systems",
        subtitle: "International Conference on Intelligent Robots and Systems.",
        frequency: "Annual",
        usualMonth: "September / October",
        badgeChip: "Large attendance",
        url: "https://www.ieee-ras.org/conferences-workshops/financially-co-sponsored/iros"
      },
      {
        id: "corl",
        name: "CoRL",
        tier: "A Tier",
        domainTag: "Robot Learning",
        subtitle: "Conference on Robot Learning.",
        frequency: "Annual",
        usualMonth: "November",
        badgeChip: "ML for robotics",
        url: "https://www.robot-learning.org"
      },
      {
        id: "rss",
        name: "RSS",
        tier: "A* Tier",
        domainTag: "Robotics · Science",
        subtitle: "Robotics: Science and Systems.",
        frequency: "Annual",
        usualMonth: "July",
        badgeChip: "Rigorous review",
        url: "https://roboticsconference.org"
      },
      {
        id: "hri",
        name: "HRI",
        tier: "A Tier",
        domainTag: "Human-Robot",
        subtitle: "ACM/IEEE International Conference on Human-Robot Interaction.",
        frequency: "Annual",
        usualMonth: "March",
        badgeChip: "Interaction focus",
        url: "https://humanrobotinteraction.org"
      },
      {
        id: "icaps",
        name: "ICAPS",
        tier: "A Tier",
        domainTag: "Planning · Scheduling",
        subtitle: "International Conference on Automated Planning and Scheduling.",
        frequency: "Annual",
        usualMonth: "June",
        badgeChip: "Planning focus",
        url: "https://icaps-conference.org"
      }
    ]
  },
  {
    id: "data",
    title: "Data Mining / Information Retrieval",
    description: "Data mining, search, recommendation and retrieval systems.",
    conferences: [
      {
        id: "kdd",
        name: "KDD",
        tier: "A* Tier",
        domainTag: "Data · Mining",
        subtitle: "Knowledge Discovery and Data Mining - premier data science conference.",
        frequency: "Annual",
        usualMonth: "August",
        badgeChip: "Industry impact",
        url: "https://kdd.org"
      },
      {
        id: "sigir",
        name: "SIGIR",
        tier: "A* Tier",
        domainTag: "IR · Search",
        subtitle: "Special Interest Group on Information Retrieval.",
        frequency: "Annual",
        usualMonth: "July",
        badgeChip: "Search & ranking",
        url: "https://sigir.org"
      },
      {
        id: "www",
        name: "WWW",
        tier: "A* Tier",
        domainTag: "Web · Graph",
        subtitle: "The Web Conference - web mining, graphs, and social networks.",
        frequency: "Annual",
        usualMonth: "April / May",
        badgeChip: "Broad scope",
        url: "https://www2025.thewebconf.org"
      },
      {
        id: "wsdm",
        name: "WSDM",
        tier: "A Tier",
        domainTag: "Web · Search",
        subtitle: "Web Search and Data Mining.",
        frequency: "Annual",
        usualMonth: "February / March",
        badgeChip: "Applied focus",
        url: "https://www.wsdm-conference.org"
      },
      {
        id: "cikm",
        name: "CIKM",
        tier: "A Tier",
        domainTag: "Information · Knowledge",
        subtitle: "Conference on Information and Knowledge Management.",
        frequency: "Annual",
        usualMonth: "October",
        badgeChip: "Broad topics",
        url: "https://www.cikmconference.org"
      },
      {
        id: "recsys",
        name: "RecSys",
        tier: "A Tier",
        domainTag: "Recommendations",
        subtitle: "ACM Conference on Recommender Systems.",
        frequency: "Annual",
        usualMonth: "September",
        badgeChip: "RecSys focus",
        url: "https://recsys.acm.org"
      },
      {
        id: "icdm",
        name: "ICDM",
        tier: "A Tier",
        domainTag: "Data Mining",
        subtitle: "IEEE International Conference on Data Mining.",
        frequency: "Annual",
        usualMonth: "December",
        badgeChip: "IEEE flagship",
        url: "https://icdm.zhonghuapu.com"
      }
    ]
  },
  {
    id: "speech",
    title: "Speech & Audio",
    description: "Speech recognition, audio processing and signal processing.",
    conferences: [
      {
        id: "interspeech",
        name: "INTERSPEECH",
        tier: "A* Tier",
        domainTag: "Speech · Audio",
        subtitle: "Conference of the International Speech Communication Association.",
        frequency: "Annual",
        usualMonth: "September",
        badgeChip: "Premier speech",
        url: "https://www.interspeech2024.org"
      },
      {
        id: "icassp",
        name: "ICASSP",
        tier: "A* Tier",
        domainTag: "Audio · Signal",
        subtitle: "International Conference on Acoustics, Speech and Signal Processing.",
        frequency: "Annual",
        usualMonth: "April / May",
        badgeChip: "Broad signal processing",
        url: "https://2025.ieeeicassp.org"
      },
      {
        id: "slt",
        name: "SLT",
        tier: "A Tier",
        domainTag: "Speech · Language",
        subtitle: "IEEE Spoken Language Technology Workshop.",
        frequency: "Biennial",
        usualMonth: "December",
        badgeChip: "Tech-focused",
        url: "https://www.slt2024.org"
      },
      {
        id: "asru",
        name: "ASRU",
        tier: "A Tier",
        domainTag: "Speech Recognition",
        subtitle: "IEEE Automatic Speech Recognition and Understanding Workshop.",
        frequency: "Biennial",
        usualMonth: "December",
        badgeChip: "ASR specialized",
        url: "https://www.asru2023.org"
      }
    ]
  },
  {
    id: "interdisciplinary",
    title: "Interdisciplinary AI",
    description: "Broad AI conferences spanning multiple domains and applications.",
    conferences: [
      {
        id: "aaai",
        name: "AAAI",
        tier: "A* Tier",
        domainTag: "General AI",
        subtitle: "Association for the Advancement of Artificial Intelligence.",
        frequency: "Annual",
        usualMonth: "February",
        badgeChip: "Broad AI topics",
        url: "https://aaai.org/conference/aaai"
      },
      {
        id: "ijcai",
        name: "IJCAI",
        tier: "A* Tier",
        domainTag: "General AI",
        subtitle: "International Joint Conference on Artificial Intelligence.",
        frequency: "Annual",
        usualMonth: "August",
        badgeChip: "International focus",
        url: "https://www.ijcai.org"
      },
      {
        id: "ecai",
        name: "ECAI",
        tier: "A Tier",
        domainTag: "European AI",
        subtitle: "European Conference on Artificial Intelligence.",
        frequency: "Biennial",
        usualMonth: "September / October",
        badgeChip: "European venue",
        url: "https://www.ecai2024.eu"
      }
    ]
  },
  {
    id: "ai-ethics",
    title: "AI Ethics & Fairness",
    description: "Responsible AI, fairness, accountability, and transparency.",
    conferences: [
      {
        id: "facct",
        name: "FAccT",
        tier: "A Tier",
        domainTag: "Fairness · Accountability",
        subtitle: "ACM Conference on Fairness, Accountability, and Transparency.",
        frequency: "Annual",
        usualMonth: "June",
        badgeChip: "Ethics focus",
        url: "https://facctconference.org"
      },
      {
        id: "aies",
        name: "AIES",
        tier: "A Tier",
        domainTag: "AI Ethics",
        subtitle: "AAAI/ACM Conference on AI, Ethics, and Society.",
        frequency: "Annual",
        usualMonth: "May / August",
        badgeChip: "Societal impact",
        url: "https://www.aies-conference.com"
      }
    ]
  },
  {
    id: "multimodal",
    title: "Multimodal & Generative AI",
    description: "Multimodal learning, generative models, and cross-modal AI.",
    conferences: [
      {
        id: "mm",
        name: "ACM MM",
        tier: "A* Tier",
        domainTag: "Multimodal",
        subtitle: "ACM International Conference on Multimedia.",
        frequency: "Annual",
        usualMonth: "October",
        badgeChip: "Premier multimedia",
        url: "https://www.acmmm.org"
      },
      {
        id: "icmr",
        name: "ICMR",
        tier: "A Tier",
        domainTag: "Multimedia · Retrieval",
        subtitle: "International Conference on Multimedia Retrieval.",
        frequency: "Annual",
        usualMonth: "June",
        badgeChip: "Retrieval focus",
        url: "https://icmr2024.org"
      }
    ]
  },
  {
    id: "specialized",
    title: "Specialized AI Applications",
    description: "Domain-specific AI conferences for healthcare, bio, and other fields.",
    conferences: [
      {
        id: "chil",
        name: "CHIL",
        tier: "A Tier",
        domainTag: "Health · ML",
        subtitle: "Conference on Health, Inference, and Learning.",
        frequency: "Annual",
        usualMonth: "June",
        badgeChip: "Healthcare AI",
        url: "https://www.chilconference.org"
      },
      {
        id: "mlhc",
        name: "MLHC",
        tier: "A Tier",
        domainTag: "ML · Healthcare",
        subtitle: "Machine Learning for Healthcare.",
        frequency: "Annual",
        usualMonth: "August",
        badgeChip: "Clinical ML",
        url: "https://www.mlforhc.org"
      },
      {
        id: "iclr-acs",
        name: "AI4Science",
        tier: "B Tier",
        domainTag: "AI · Science",
        subtitle: "AI for Science workshops at major ML conferences.",
        frequency: "Annual",
        usualMonth: "Varies",
        badgeChip: "Scientific AI",
        url: "https://ai4sciencecommunity.github.io"
      }
    ]
  }
];
