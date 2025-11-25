import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashNav from "@/components/dashnav/dashnav";
import ProfileStepper from "./components/ProfileStepper";
import PersonalDetailsForm from "./components/PersonalDetailsForm";
import EducationDetailsForm from "./components/EducationDetailsForm";
import ExperienceDetailsForm from "./components/ExperienceDetailsForm";
import ProjectDetailsForm from "./components/ProjectDetailsForm";
import SkillsLinksDetailsForm from "./components/SkillsLinksDetailsForm";
import CertificationDetailsForm from "./components/CertificationDetailsForm";
import api from "@/api";  

export default function ProfileForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {},
    education: {},
    experience: {},
    projects: {},
    skills: {},
    certification: {},
  });
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});
  
  const location = useLocation();
  const navigate = useNavigate();
  const parsedData = JSON.parse(localStorage.getItem("user"));


  const steps = [
    "Personal",
    "Education",
    "Experience",
    "Projects",
    "Skills & Links",
    "Certification",
  ];

  const submitAllProfileData = async (data: any) => {
    try {
      const userId = parsedData?.user_id;
      const token = parsedData?.token;
      const authHeader = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
          const personalFD = new FormData();

          personalFD.append("user_id", userId);
          personalFD.append("first_name", data.personal.firstName || "");
          personalFD.append("middle_name", data.personal.middleName || "");
          personalFD.append("last_name", data.personal.lastName || "");

          personalFD.append("email", data.personal.email || "");
          personalFD.append("mobile_number", data.personal.mobileNumber || "");

          if (data.personal.dateOfBirth && data.personal.dateOfBirth.trim() !== "") {
            personalFD.append("date_of_birth", data.personal.dateOfBirth);
          }

          personalFD.append("gender", data.personal.gender || "");

          if (Array.isArray(data.personal.languages)) {
            data.personal.languages.forEach((lang) => {
              personalFD.append("languages_known[]", lang);
            });
          }

          if (data.personal.uploadedPhotoURL) {
            personalFD.append("profile_photo_url", data.personal.uploadedPhotoURL);
          } else if (data.personal.profilePhoto instanceof File) {
            personalFD.append("profile_photo_url", data.personal.profilePhoto);
          } else if (typeof data.personal.profilePhoto === "string") {
            personalFD.append("profile_photo_url", data.personal.profilePhoto);
          }

          personalFD.append("address", data.personal.address || "");
          personalFD.append("country", data.personal.country || "");
          personalFD.append("state", data.personal.state || "");
          personalFD.append("city", data.personal.city || "");
          personalFD.append("pincode", data.personal.pincode || "");
          personalFD.append("nationality", data.personal.nationality || "");
          personalFD.append("passport_number", data.personal.passportNumber || "");

          await api.post(`/users/${userId}/personal-details`, personalFD, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });



      // 2️⃣ EDUCATION
      const buildYear = (val: any) => {
        if (val === undefined || val === null || val === "") return null;
        if (typeof val === "string" && val.includes("-")) {
          const yearPart = val.split("-")[0];
          const y = parseInt(yearPart, 10);
          return isNaN(y) ? yearPart : y;
        }
        const n = parseInt(val as any, 10);
        return isNaN(n) ? val : n;
      };

      const educationArray: any[] = [];

      const sslc = data.education?.sslc;
      if (sslc && (sslc.institutionName || sslc.result || sslc.yearOfPassing)) {
        educationArray.push({
          education_type: "sslc",
          institution_name: sslc.institutionName || "",
          board_type: sslc.boardType || "",
          end_year: buildYear(sslc.yearOfPassing),
          result_format: (sslc.resultFormat || "").toLowerCase(),
          result: sslc.result || "",
        });
      }

      const puc = data.education?.pu;
      if (puc && (puc.institutionName || puc.result || puc.yearOfPassing)) {
        educationArray.push({
          education_type: "puc",
          institution_name: puc.institutionName || "",
          board_type: puc.boardType || "",
          subject_stream: puc.subjectStream || "",
          end_year: buildYear(puc.yearOfPassing),
          result_format: (puc.resultFormat || "").toLowerCase(),
          result: puc.result || "",
        });
      }

      const higherList = [
        ...(data.education?.higherEducations || []),
        ...(data.education?.extraEducations || []),
      ];

      for (const he of higherList) {
        if (!he || (!he.degree && !he.institutionName && !he.fieldOfStudy)) continue;
        educationArray.push({
          education_type: "higher",
          degree: he.degree || "",
          field_of_study: he.fieldOfStudy || "",
          institution_name: he.institutionName || "",
          university_name: he.universityBoard || he.universityName || "",
          start_year: buildYear(he.startYear),
          end_year: buildYear(he.endYear),
          result_format: (he.resultFormat || "").toLowerCase(),
          result: he.result || "",
          currently_pursuing: !!he.currentlyPursuing,
        });
      }

      if (educationArray.length > 0) {
        await api.post(`/users/${userId}/education`, educationArray, authHeader);
      }

      // 3️⃣ EXPERIENCE 
      const expData = data.experience || {};
      const normalizeMonthToDate = (val: any) => {
        if (!val) return null;
        if (typeof val === "string") {
          if (/^\d{4}-\d{2}$/.test(val)) return `${val}-01`;
          if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
        }
        return val;
      };
      const experiencesList = expData.workExperiences || expData.experienceDetails || [];
      const experiencesPayload: any[] = [];

      for (const w of experiencesList) {
        if (!w) continue;
        experiencesPayload.push({
          company_name: w.companyName || w.company_name || "",
          job_title: w.jobTitle || w.job_title || "",
          employment_type: w.employmentType || w.employment_type || "",
          location: w.location || "",
          work_mode: w.workMode || w.work_mode || "",
          start_date: normalizeMonthToDate(w.startDate || w.start_date),
          end_date: normalizeMonthToDate(w.endDate || w.end_date),
          currently_working_here: !!w.currentlyWorking || !!w.currently_working_here,
          description: w.description || "",
        });
      }

      if (experiencesPayload.length > 0 || expData.jobRole) {
        await api.post(
          `/users/${userId}/work-experience`,
          {
            job_role: expData.jobRole || expData.job_role || "",
            experiences: experiencesPayload,
          },
          authHeader
        );
      }

      // 4️⃣ PROJECTS — send all projects in one JSON payload
      const projectsData = data.projects || {};
      const projectsList = projectsData.projects || projectsData.projectDetails || [];
      const projectsPayload: any[] = [];

      for (const p of projectsList) {
        if (!p) continue;
        projectsPayload.push({
          project_title: p.projectTitle || p.project_title || "",
          project_type: p.projectType || p.project_type || "",
          start_date: normalizeMonthToDate(p.startDate || p.start_date),
          end_date: normalizeMonthToDate(p.endDate || p.end_date),
          currently_working: !!p.currentlyWorking || !!p.currently_working,
          description: p.description || "",
          roles_responsibilities: p.rolesAndResponsibilities || p.roles_responsibilities || "",
        });
      }

      if (projectsPayload.length > 0) {
        await api.post(
          `/users/${userId}/projects`,
          { projects: projectsPayload },
          authHeader
        );
      }

      // 5️⃣ SKILLS — send skills as single JSON array
      const skillsData = data.skills || {};
      const skillsList = Array.isArray(skillsData.skills)
        ? skillsData.skills
        : Array.isArray(skillsData)
        ? skillsData
        : [];

      const skillsPayload = skillsList
        .filter((s: any) => s && (s.skillName || s.skill_name))
        .map((s: any) => ({
          skill_name: s.skillName || s.skill_name || "",
          skill_level: s.skillLevel || s.skill_level || "",
        }));

      if (skillsPayload.length > 0) {
        await api.post(`/users/${userId}/skills`, { skills: skillsPayload }, authHeader);
      }

      const linksData = data.skills || {};
      const linksList = Array.isArray(linksData.links)
        ? linksData.links
        : Array.isArray(linksData)
        ? linksData
        : [];

      const linksPayload: any[] = [];

      for (const l of linksList) {
        if (!l) continue;
        if (l.linkedinProfile) {
          linksPayload.push({ link_type: "linkedin", url: l.linkedinProfile });
        }
        if (l.githubProfile) {
          linksPayload.push({ link_type: "github", url: l.githubProfile });
        }
        if (l.portfolioUrl) {
          linksPayload.push({
            link_type: "portfolio",
            url: l.portfolioUrl,
            description: l.portfolioDescription || "",
          });
        }
        if (l.publicationUrl) {
          linksPayload.push({
            link_type: "publication",
            url: l.publicationUrl,
            description: l.publicationDescription || "",
          });
        }
      }

      if (linksPayload.length > 0) {
        await api.post(`/users/${userId}/links`, { links: linksPayload }, authHeader);
      }

      // 7️⃣ CERTIFICATES — WITH FILE UPLOAD
      if (data.certification.certificates) {
        for (const cert of data.certification.certificates) {
          const formData = new FormData();
          formData.append("certificate_type", cert.certificateType);
          formData.append("certificate_title", cert.certificateTitle);
          formData.append("domain", cert.domain);
          formData.append("certificate_provided_by", cert.certificateProvidedBy);
          // formData.append("date", cert.date);
          // CERTIFICATE DATE
          formData.append("description", cert.description);

          // *** ⬇️ IMPORTANT CHANGE — SEND Cloudinary URL, not File ***
          if (cert.uploadedFileUrl) {
            formData.append("file_url", cert.uploadedFileUrl);   // <<--- URL stored in BE
          }




          await api.post(
            `/users/${userId}/certificates`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      }

      alert("Profile saved successfully!");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Failed to save profile. Try again.");
    }
  };

  // Validation function to check if step has any validation errors
  const validateStepData = (stepIndex: number, data: any): boolean => {
    const stepKeys = [
      "personal",
      "education",
      "experience",
      "projects",
      "skills",
      "certification",
    ];
    
    // Basic validation - check if data exists
    if (!data || Object.keys(data).length === 0) {
      return false;
    }

    // Step-specific validation
    switch (stepIndex) {
      case 0: // Personal Details
        if (!data.firstName || !data.lastName) {
          return false;
        }
        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          return false;
        }
        if (data.phoneNumber && !/^[0-9]{10,15}$/.test(data.phoneNumber.replace(/[\s-]/g, ''))) {
          return false;
        }
        break;

      case 1: 
        if (data.educationDetails && Array.isArray(data.educationDetails)) {
          const hasValidEducation = data.educationDetails.some(
            (edu: any) => edu.institutionName && edu.degree
          );
          if (!hasValidEducation) {
            return false;
          }
        }
        break;

      case 2:
        if (!data.jobRole) {
          return false;
        }
        break;

      case 3:
        break;

      case 4:
        if (data.skills && Array.isArray(data.skills)) {
          const hasValidSkill = data.skills.some((skill: any) => skill.skillName);
          if (!hasValidSkill) {
            return false;
          }
        }
        break;

      case 5:
        break;
    }

    return true;
  };

  // ⭐⭐⭐ FIXED handleNext — ONLY THIS PART UPDATED ⭐⭐⭐
  const handleNext = async (data: any) => {
    const stepKeys = [
      "personal",
      "education",
      "experience",
      "projects",
      "skills",
      "certification",
    ];

    // Merge current step data
    const updatedFormData = {
      ...formData,
      [stepKeys[currentStep]]: data,
    };

    setFormData(updatedFormData);

    // Validate current step
    const isValid = validateStepData(currentStep, data);
    setValidationErrors((prev) => ({
      ...prev,
      [stepKeys[currentStep]]: !isValid,
    }));

    if (!isValid) return;

    // Not last step → move to next
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Last step → validate all steps
    let hasErrors = false;
    const allErrors: { [key: string]: boolean } = {};

    stepKeys.forEach((key, index) => {
      const stepData = index === currentStep ? data : formData[key];
      const isStepValid = validateStepData(index, stepData);
      if (!isStepValid) {
        hasErrors = true;
        allErrors[key] = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(allErrors);
      console.log("Validation errors found. Please complete all required fields.");
      return;
    }

    await submitAllProfileData(updatedFormData);
  };
 

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalDetailsForm
            onNext={handleNext}
            onBack={handleBack}
            initialData={formData.personal}
          />
        );
      case 1:
        return (
          <EducationDetailsForm
            onNext={handleNext}
            onBack={handleBack}
            initialData={formData.education}
          />
        );
      case 2:
        return (
          <ExperienceDetailsForm
            onNext={handleNext}
            onBack={handleBack}
            initialData={formData.experience}
          />
        );
      case 3:
        return (
          <ProjectDetailsForm
            onNext={handleNext}
            onBack={handleBack}
            initialData={formData.projects}
          />
        );
      case 4:
        return (
          <SkillsLinksDetailsForm
            onNext={handleNext}
            onBack={handleBack}
            initialData={formData.skills}
          />
        );
      case 5:
        return (
          <CertificationDetailsForm
            onNext={handleNext}
            onBack={handleBack}
            initialData={formData.certification}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-['Baloo_2']">
      <DashNav heading="Profile" />

      <div className="flex-1 bg-gray-50 overflow-hidden">
        <div className="bg-white rounded-lg м-3 md:m-5 h-[calc(100vh-110px)] overflow-auto flex flex-col">
          {/* Header Section */}
          <div className="border-b border-gray-200 px-4 sm:px-6 md:px-8 py-4 md:py-5">
            <p className="text-sm sm:text-base text-gray-700 mb-3 md:mb-4">
              Providing your details in profile helps us personalize every step
              - from building the right resume to preparing you for interviews
              that matter.
            </p>

            {/* Stepper */}
            <ProfileStepper
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-auto">{renderStepContent()}</div>
        </div>
      </div>
    </div>
  );
}
