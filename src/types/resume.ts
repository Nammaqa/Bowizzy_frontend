
export interface PersonalDetails {
  profilePhotoUrl: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  gender: string;
  languagesKnown: string[];
  address: string;
  country: string;
  city: string;
  nationality: string;
  state: string;
  pincode: string;
  passportNumber: string;
  aboutCareerObjective: string;
}

export interface SSLCEducation {
  instituteName: string;
  boardType: string;
  yearOfPassing: string;
  resultFormat: string;
  result: string;
}

export interface PreUniversityEducation {
  instituteName: string;
  boardType: string;
  subjectStream: string;
  yearOfPassing: string;
  resultFormat: string;
  result: string;
}

export interface HigherEducation {
  id: string;
  degree: string;
  fieldOfStudy: string;
  instituteName: string;
  universityBoard: string;
  startYear: string;
  endYear: string;
  resultFormat: string;
  result: string;
}

export interface EducationDetails {
  sslc: SSLCEducation;
  sslcEnabled: boolean;
  preUniversity: PreUniversityEducation;
  preUniversityEnabled: boolean;
  higherEducation: HigherEducation[];
  higherEducationEnabled: boolean;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  jobTitle: string;
  employmentType: string;
  location: string;
  workMode: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  enabled: boolean;
}

export interface ExperienceDetails {
  jobRole: string;
  workExperiences: WorkExperience[];
}

export interface Project {
  id: string;
  projectTitle: string;
  projectType: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  rolesResponsibilities: string;
  enabled: boolean;
}

export interface Skill {
  id: string;
  skillName: string;
  skillLevel: string;
  enabled: boolean;
}

export interface Links {
  linkedinProfile: string;
  linkedinEnabled: boolean;
  githubProfile: string;
  githubEnabled: boolean;
  portfolioUrl: string;
  portfolioEnabled: boolean;
  portfolioDescription: string;
  publicationUrl: string;
  publicationEnabled: boolean;
  publicationDescription: string;
}


export interface SkillsLinksDetails {
  skills: Skill[];
  links: Links;
  linksEnabled: boolean;
  technicalSummary: string;
  technicalSummaryEnabled: boolean;
}

export interface Certificate {
  id: string;
  certificateType: string;
  certificateTitle: string;
  domain: string;
  providedBy: string;
  date: string;
  description: string;
  certificateUrl: string;
  enabled: boolean;
}

export interface ResumeData {
  personal: PersonalDetails;
  education: EducationDetails;
  experience: ExperienceDetails;
  projects: Project[];
  skillsLinks: SkillsLinksDetails;
  certifications: Certificate[];
}

export const initialResumeData: ResumeData = {
  personal: {
    profilePhotoUrl: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: '',
    languagesKnown: [],
    address: '',
    country: 'India',
    city: '',
    nationality: '',
    state: '',
    pincode: '',
    passportNumber: '',
    aboutCareerObjective: '',
  },
  education: {
    sslc: {
      instituteName: '',
      boardType: '',
      yearOfPassing: '',
      resultFormat: '',
      result: '',
    },
    sslcEnabled: true,
    preUniversity: {
      instituteName: '',
      boardType: '',
      subjectStream: '',
      yearOfPassing: '',
      resultFormat: '',
      result: '',
    },
    preUniversityEnabled: true,
    higherEducation: [],
    higherEducationEnabled: true,
  },
  experience: {
    jobRole: '',
    workExperiences: [
      {
        id: '1',
        companyName: '',
        jobTitle: '',
        employmentType: '',
        location: '',
        workMode: '',
        startDate: '',
        endDate: '',  
        currentlyWorking: false,
        description: '',
        enabled: true,
      },
    ],
  },
  projects: [
    {
      id: '1',
      projectTitle: '',
      projectType: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      rolesResponsibilities: '',
      enabled: true,
    },
  ],
  skillsLinks: {
  skills: [
    { id: '1', skillName: '', skillLevel: '', enabled: true },
    { id: '2', skillName: '', skillLevel: '', enabled: true },
  ],
  links: {
    linkedinProfile: '',
    linkedinEnabled: true,
    githubProfile: '',
    githubEnabled: true,
    portfolioUrl: '',
    portfolioEnabled: true,
    portfolioDescription: '',
    publicationUrl: '',
    publicationEnabled: true,
    publicationDescription: '',
  },
  linksEnabled: true,
  technicalSummary: '',
  technicalSummaryEnabled: true,
},
  certifications: [
    {
      id: '1',
      certificateType: '',
      certificateTitle: '',
      domain: '',
      providedBy: '',
      date: '',
      description: '',
      certificateUrl: '',
      enabled: true,
    },
  ],
};