import React, { useMemo, useCallback, useState } from "react";
import type { ResumeData } from "@/types/resume";

// ✅ react-pdf imports (2nd best option)
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

interface ModernProfessionalTemplateProps {
  data: ResumeData;
}

interface PageContent {
  leftContent: React.ReactNode[];
  rightContent: React.ReactNode[];
}

// ✅ PDF styles for A4 auto-pagination
const pdfStyles = StyleSheet.create({
  page: {
    padding: 20,
    flexDirection: "row",
  },
  left: {
    width: "35%",
    backgroundColor: "#F5E6D3",
    padding: 16,
  },
  right: {
    width: "65%",
    padding: 16,
  },
  heading: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
    marginBottom: 3,
  },
  section: {
    marginTop: 10,
  },
});

// ✅ PDF document component (react-pdf handles page breaks automatically)
const ResumePDF: React.FC<{ data: ResumeData }> = ({ data }) => {
  const fullName = [
    data.personal.firstName,
    data.personal.middleName,
    data.personal.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const formatMonthYear = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page} wrap>
        {/* LEFT COLUMN */}
        <View style={pdfStyles.left}>
          {/* Contact */}
          {(data.personal.address ||
            data.personal.email ||
            data.personal.mobileNumber) && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.heading}>Contact</Text>
              {data.personal.address && (
                <Text style={pdfStyles.text}>{data.personal.address}</Text>
              )}
              {data.personal.city && (
                <Text style={pdfStyles.text}>{data.personal.city}</Text>
              )}
              {data.personal.state && (
                <Text style={pdfStyles.text}>{data.personal.state}</Text>
              )}
              {data.personal.pincode && (
                <Text style={pdfStyles.text}>{data.personal.pincode}</Text>
              )}
              {data.personal.email && (
                <Text style={pdfStyles.text}>{data.personal.email}</Text>
              )}
              {data.personal.mobileNumber && (
                <Text style={pdfStyles.text}>{data.personal.mobileNumber}</Text>
              )}
            </View>
          )}

          {/* About Me */}
          {data.personal.aboutCareerObjective && (
            <View style={pdfStyles.section}>
              <Text style={pdfStyles.heading}>About Me</Text>
              <Text style={pdfStyles.text}>
                {data.personal.aboutCareerObjective}
              </Text>
            </View>
          )}

          {/* Skills */}
          {data.skillsLinks.skills &&
            data.skillsLinks.skills.some(
              (s) => s.enabled && s.skillName.trim()
            ) && (
              <View style={pdfStyles.section}>
                <Text style={pdfStyles.heading}>Skills</Text>
                {data.skillsLinks.skills
                  .filter((s) => s.enabled)
                  .map((s, i) => (
                    <Text key={i} style={pdfStyles.text}>
                      {s.skillName}
                      {s.skillLevel ? ` (${s.skillLevel})` : ""}
                    </Text>
                  ))}
              </View>
            )}

          {/* Languages */}
          {data.personal.languagesKnown &&
            data.personal.languagesKnown.length > 0 && (
              <View style={pdfStyles.section}>
                <Text style={pdfStyles.heading}>Languages</Text>
                {data.personal.languagesKnown.map((lang, i) => (
                  <Text key={i} style={pdfStyles.text}>
                    {lang}
                  </Text>
                ))}
              </View>
            )}

          {/* Links */}
          {data.skillsLinks.linksEnabled &&
            (data.skillsLinks.links.linkedinProfile ||
              data.skillsLinks.links.githubProfile ||
              data.skillsLinks.links.portfolioUrl) && (
              <View style={pdfStyles.section}>
                <Text style={pdfStyles.heading}>Links</Text>
                {data.skillsLinks.links.linkedinEnabled &&
                  data.skillsLinks.links.linkedinProfile && (
                    <View>
                      <Text style={pdfStyles.subHeading}>LinkedIn</Text>
                      <Text style={pdfStyles.text}>
                        {data.skillsLinks.links.linkedinProfile}
                      </Text>
                    </View>
                  )}
                {data.skillsLinks.links.githubEnabled &&
                  data.skillsLinks.links.githubProfile && (
                    <View>
                      <Text style={pdfStyles.subHeading}>GitHub</Text>
                      <Text style={pdfStyles.text}>
                        {data.skillsLinks.links.githubProfile}
                      </Text>
                    </View>
                  )}
                {data.skillsLinks.links.portfolioEnabled &&
                  data.skillsLinks.links.portfolioUrl && (
                    <View>
                      <Text style={pdfStyles.subHeading}>Portfolio</Text>
                      <Text style={pdfStyles.text}>
                        {data.skillsLinks.links.portfolioUrl}
                      </Text>
                    </View>
                  )}
              </View>
            )}
        </View>

        {/* RIGHT COLUMN */}
        <View style={pdfStyles.right}>
          {/* Header */}
          <View>
            <Text style={{ fontSize: 22, fontWeight: 700 }}>{fullName}</Text>
            {data.experience.jobRole && (
              <Text style={{ fontSize: 12, marginTop: 4 }}>
                {data.experience.jobRole}
              </Text>
            )}
          </View>

          {/* Education */}
          {(data.education.higherEducationEnabled &&
            data.education.higherEducation.length > 0) ||
          (data.education.preUniversityEnabled &&
            data.education.preUniversity.instituteName) ||
          (data.education.sslcEnabled &&
            data.education.sslc.instituteName) ? (
            <View style={pdfStyles.section} wrap>
              <Text style={pdfStyles.heading}>Education</Text>

              {data.education.higherEducationEnabled &&
                data.education.higherEducation.map((edu, i) => (
                  <View key={edu.id || i} wrap>
                    <Text style={pdfStyles.subHeading}>
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </Text>
                    {edu.instituteName && (
                      <Text style={pdfStyles.text}>{edu.instituteName}</Text>
                    )}
                    {(edu.startYear || edu.endYear) && (
                      <Text style={pdfStyles.text}>
                        {edu.startYear}
                        {edu.endYear ? ` - ${edu.endYear}` : ""}
                      </Text>
                    )}
                    {edu.universityBoard && (
                      <Text style={pdfStyles.text}>
                        {edu.universityBoard}
                      </Text>
                    )}
                    {edu.result && edu.resultFormat && (
                      <Text style={pdfStyles.text}>
                        {edu.resultFormat}: {edu.result}
                      </Text>
                    )}
                  </View>
                ))}

              {data.education.preUniversityEnabled &&
                data.education.preUniversity.instituteName && (
                  <View wrap>
                    <Text style={pdfStyles.subHeading}>
                      Pre-University / 12th
                      {data.education.preUniversity.subjectStream
                        ? ` (${data.education.preUniversity.subjectStream})`
                        : ""}
                    </Text>
                    <Text style={pdfStyles.text}>
                      {data.education.preUniversity.instituteName}
                    </Text>
                    {data.education.preUniversity.yearOfPassing && (
                      <Text style={pdfStyles.text}>
                        {data.education.preUniversity.yearOfPassing}
                      </Text>
                    )}
                  </View>
                )}

              {data.education.sslcEnabled &&
                data.education.sslc.instituteName && (
                  <View wrap>
                    <Text style={pdfStyles.subHeading}>SSLC / 10th</Text>
                    <Text style={pdfStyles.text}>
                      {data.education.sslc.instituteName}
                    </Text>
                    {data.education.sslc.yearOfPassing && (
                      <Text style={pdfStyles.text}>
                        {data.education.sslc.yearOfPassing}
                      </Text>
                    )}
                  </View>
                )}
            </View>
          ) : null}

          {/* Experience */}
          {data.experience.workExperiences &&
            data.experience.workExperiences.some(
              (exp) => exp.enabled && (exp.companyName || exp.jobTitle)
            ) && (
              <View style={pdfStyles.section} wrap>
                <Text style={pdfStyles.heading}>Experience</Text>
                {data.experience.workExperiences
                  .filter((exp) => exp.enabled && (exp.companyName || exp.jobTitle))
                  .map((exp, i) => (
                    <View key={exp.id || i} wrap>
                      {exp.jobTitle && (
                        <Text style={pdfStyles.subHeading}>{exp.jobTitle}</Text>
                      )}
                      {exp.companyName && (
                        <Text style={pdfStyles.text}>
                          {exp.companyName}
                          {exp.location ? ` | ${exp.location}` : ""}
                        </Text>
                      )}
                      {(exp.startDate ||
                        exp.endDate ||
                        exp.currentlyWorking) && (
                        <Text style={pdfStyles.text}>
                          {exp.startDate ? formatMonthYear(exp.startDate) : ""} -{" "}
                          {exp.currentlyWorking
                            ? "Present"
                            : exp.endDate
                            ? formatMonthYear(exp.endDate)
                            : ""}
                        </Text>
                      )}
                      {exp.description && (
                        <Text style={pdfStyles.text}>{exp.description}</Text>
                      )}
                    </View>
                  ))}
              </View>
            )}

          {/* Projects */}
          {data.projects &&
            data.projects.some((proj) => proj.enabled && proj.projectTitle) && (
              <View style={pdfStyles.section} wrap>
                <Text style={pdfStyles.heading}>Projects</Text>
                {data.projects
                  .filter((proj) => proj.enabled && proj.projectTitle)
                  .map((proj, i) => (
                    <View key={proj.id || i} wrap>
                      <Text style={pdfStyles.subHeading}>
                        {proj.projectTitle}
                      </Text>
                      {proj.projectType && (
                        <Text style={pdfStyles.text}>{proj.projectType}</Text>
                      )}
                      {(proj.startDate ||
                        proj.endDate ||
                        proj.currentlyWorking) && (
                        <Text style={pdfStyles.text}>
                          {proj.startDate
                            ? formatMonthYear(proj.startDate)
                            : ""}{" "}
                          -{" "}
                          {proj.currentlyWorking
                            ? "Present"
                            : proj.endDate
                            ? formatMonthYear(proj.endDate)
                            : ""}
                        </Text>
                      )}
                      {proj.description && (
                        <Text style={pdfStyles.text}>{proj.description}</Text>
                      )}
                    </View>
                  ))}
              </View>
            )}

          {/* Certifications */}
          {data.certifications &&
            data.certifications.some(
              (cert) => cert.enabled && cert.certificateTitle
            ) && (
              <View style={pdfStyles.section} wrap>
                <Text style={pdfStyles.heading}>Certifications</Text>
                {data.certifications
                  .filter((cert) => cert.enabled && cert.certificateTitle)
                  .map((cert, i) => (
                    <View key={cert.id || i} wrap>
                      <Text style={pdfStyles.subHeading}>
                        {cert.certificateTitle}
                      </Text>
                      {cert.providedBy && (
                        <Text style={pdfStyles.text}>{cert.providedBy}</Text>
                      )}
                      {cert.date && (
                        <Text style={pdfStyles.text}>
                          {formatMonthYear(cert.date)}
                        </Text>
                      )}
                    </View>
                  ))}
              </View>
            )}

          {/* Personal Details */}
          {(data.personal.dateOfBirth ||
            data.personal.gender ||
            data.personal.nationality ||
            data.personal.passportNumber) && (
            <View style={pdfStyles.section} wrap>
              <Text style={pdfStyles.heading}>Personal Details</Text>
              {data.personal.dateOfBirth && (
                <Text style={pdfStyles.text}>
                  Date of Birth:{" "}
                  {new Date(
                    data.personal.dateOfBirth
                  ).toLocaleDateString()}
                </Text>
              )}
              {data.personal.gender && (
                <Text style={pdfStyles.text}>
                  Gender: {data.personal.gender}
                </Text>
              )}
              {data.personal.nationality && (
                <Text style={pdfStyles.text}>
                  Nationality: {data.personal.nationality}
                </Text>
              )}
              {data.personal.passportNumber && (
                <Text style={pdfStyles.text}>
                  Passport: {data.personal.passportNumber}
                </Text>
              )}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export const ModernProfessionalTemplate: React.FC<
  ModernProfessionalTemplateProps
> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Helper functions
  const fullName = [
    data.personal.firstName,
    data.personal.middleName,
    data.personal.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .toUpperCase();

  const formatMonthYear = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const buildAddress = () => {
    const parts = [];
    if (data.personal.address) parts.push(data.personal.address);
    if (data.personal.city) parts.push(data.personal.city);
    if (data.personal.state) parts.push(data.personal.state);
    if (data.personal.pincode) parts.push(data.personal.pincode);
    return parts.join(", ");
  };

  const address = buildAddress();

  const getJobTitle = useCallback(() => {
    if (data.experience.jobRole) return data.experience.jobRole;
    if (data.experience.workExperiences?.[0]?.jobTitle)
      return data.experience.workExperiences[0].jobTitle;
    return "";
  }, [data.experience]);

  // Build pages with intelligent content distribution
  const { pages, totalPages } = useMemo(() => {
    const pagesArray: PageContent[] = [];
    let currentLeftItems: React.ReactNode[] = [];
    let currentRightItems: React.ReactNode[] = [];

    let leftHeight = 0;
    let rightHeight = 0;
    const pageCapacity = 50; // A4 page capacity in relative units

    const createNewPage = () => {
      if (currentLeftItems.length > 0 || currentRightItems.length > 0) {
        pagesArray.push({
          leftContent: currentLeftItems,
          rightContent: currentRightItems,
        });
      }
      currentLeftItems = [];
      currentRightItems = [];
      leftHeight = 0;
      rightHeight = 0;
    };

    const addLeftItem = (item: React.ReactNode, height: number) => {
      if (leftHeight + height > pageCapacity && currentLeftItems.length > 0) {
        createNewPage();
      }
      currentLeftItems.push(item);
      leftHeight += height;
    };

    const addRightItem = (item: React.ReactNode, height: number) => {
      if (rightHeight + height > pageCapacity && currentRightItems.length > 0) {
        createNewPage();
      }
      currentRightItems.push(item);
      rightHeight += height;
    };

    // LEFT SIDEBAR
    if (address || data.personal.email || data.personal.mobileNumber) {
      addLeftItem(
        <div key="contact" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
            }}
          >
            Contact
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              fontSize: "0.75rem",
              color: "rgb(55, 65, 81)",
            }}
          >
            {address && (
              <p style={{ lineHeight: "1.5", wordBreak: "break-word" }}>
                {address}
              </p>
            )}
            {data.personal.email && (
              <p style={{ lineHeight: "1.5", wordBreak: "break-word" }}>
                {data.personal.email}
              </p>
            )}
            {data.personal.mobileNumber && <p>{data.personal.mobileNumber}</p>}
          </div>
        </div>,
        8
      );
    }

    if (data.personal.aboutCareerObjective) {
      addLeftItem(
        <div key="about" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
            }}
          >
            About Me
          </h3>
          <p
            style={{
              fontSize: "0.75rem",
              color: "rgb(55, 65, 81)",
              lineHeight: "1.5",
            }}
          >
            {data.personal.aboutCareerObjective}
          </p>
        </div>,
        10
      );
    }

    if (
      data.skillsLinks.skills &&
      data.skillsLinks.skills.some((s) => s.enabled && s.skillName.trim())
    ) {
      addLeftItem(
        <div key="skills" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
            }}
          >
            Skills
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}
          >
            {data.skillsLinks.skills
              .filter((s) => s.enabled)
              .map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: "0.75rem",
                    color: "rgb(55, 65, 81)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{skill.skillName}</span>
                  {skill.skillLevel && (
                    <span
                      style={{ fontSize: "10px", color: "rgb(107, 114, 128)" }}
                    >
                      {skill.skillLevel}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>,
        8 + data.skillsLinks.skills.filter((s) => s.enabled).length * 1.5
      );
    }

    if (
      data.personal.languagesKnown &&
      data.personal.languagesKnown.length > 0
    ) {
      addLeftItem(
        <div key="languages" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
            }}
          >
            Languages
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}
          >
            {data.personal.languagesKnown.map((lang, idx) => (
              <div
                key={idx}
                style={{ fontSize: "0.75rem", color: "rgb(55, 65, 81)" }}
              >
                {lang}
              </div>
            ))}
          </div>
        </div>,
        5 + data.personal.languagesKnown.length * 1.5
      );
    }

    if (
      data.skillsLinks.linksEnabled &&
      (data.skillsLinks.links.linkedinProfile ||
        data.skillsLinks.links.githubProfile ||
        data.skillsLinks.links.portfolioUrl)
    ) {
      addLeftItem(
        <div key="links" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
            }}
          >
            Links
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              fontSize: "0.75rem",
              color: "rgb(55, 65, 81)",
            }}
          >
            {data.skillsLinks.links.linkedinEnabled &&
              data.skillsLinks.links.linkedinProfile && (
                <div>
                  <p
                    style={{ fontWeight: "600", color: "rgb(31, 41, 55)" }}
                  >
                    LinkedIn
                  </p>
                  <p
                    style={{
                      wordBreak: "break-word",
                      color: "rgb(37, 99, 235)",
                    }}
                  >
                    {data.skillsLinks.links.linkedinProfile}
                  </p>
                </div>
              )}
            {data.skillsLinks.links.githubEnabled &&
              data.skillsLinks.links.githubProfile && (
                <div>
                  <p
                    style={{ fontWeight: "600", color: "rgb(31, 41, 55)" }}
                  >
                    GitHub
                  </p>
                  <p
                    style={{
                      wordBreak: "break-word",
                      color: "rgb(37, 99, 235)",
                    }}
                  >
                    {data.skillsLinks.links.githubProfile}
                  </p>
                </div>
              )}
            {data.skillsLinks.links.portfolioEnabled &&
              data.skillsLinks.links.portfolioUrl && (
                <div>
                  <p
                    style={{ fontWeight: "600", color: "rgb(31, 41, 55)" }}
                  >
                    Portfolio
                  </p>
                  <p
                    style={{
                      wordBreak: "break-word",
                      color: "rgb(37, 99, 235)",
                    }}
                  >
                    {data.skillsLinks.links.portfolioUrl}
                  </p>
                  {data.skillsLinks.links.portfolioDescription && (
                    <p
                      style={{
                        marginTop: "0.25rem",
                        color: "rgb(75, 85, 99)",
                      }}
                    >
                      {data.skillsLinks.links.portfolioDescription}
                    </p>
                  )}
                </div>
              )}
          </div>
        </div>,
        10
      );
    }

    // RIGHT CONTENT
    if (fullName) {
      addRightItem(
        <div key="header" style={{ breakInside: "avoid" }}>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              color: "rgb(17, 24, 39)",
              lineHeight: "1.25",
            }}
          >
            {fullName.split(" ")[0]}
            {fullName.split(" ").length > 1 && (
              <>
                <br />
                {fullName.split(" ").slice(1).join(" ")}
              </>
            )}
          </h1>
          {getJobTitle() && (
            <p
              style={{
                fontSize: "1rem",
                color: "rgb(55, 65, 81)",
                marginTop: "0.25rem",
              }}
            >
              {getJobTitle()}
            </p>
          )}
        </div>,
        8
      );
    }

    if (
      (data.education.sslcEnabled && data.education.sslc.instituteName) ||
      (data.education.preUniversityEnabled &&
        data.education.preUniversity.instituteName) ||
      (data.education.higherEducationEnabled &&
        data.education.higherEducation.length > 0)
    ) {
      addRightItem(
        <div key="education" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
              borderBottom: "1px solid rgb(209, 213, 219)",
              paddingBottom: "0.25rem",
            }}
          >
            Education
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {data.education.higherEducationEnabled &&
              data.education.higherEducation.map((edu, idx) => (
                <div key={edu.id || idx} style={{ breakInside: "avoid" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      {edu.degree}{" "}
                      {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </p>
                    {(edu.startYear || edu.endYear) && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "rgb(75, 85, 99)",
                        }}
                      >
                        {edu.startYear} {edu.endYear && `- ${edu.endYear}`}
                      </span>
                    )}
                  </div>
                  {edu.instituteName && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(55, 65, 81)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {edu.instituteName}
                    </p>
                  )}
                  {edu.universityBoard && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(75, 85, 99)",
                      }}
                    >
                      {edu.universityBoard}
                    </p>
                  )}
                  {edu.result && edu.resultFormat && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(75, 85, 99)",
                        marginTop: "0.25rem",
                      }}
                    >
                      {edu.resultFormat}: {edu.result}
                    </p>
                  )}
                </div>
              ))}
            {data.education.preUniversityEnabled &&
              data.education.preUniversity.instituteName && (
                <div style={{ breakInside: "avoid" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      Pre-University / 12th{" "}
                      {data.education.preUniversity.subjectStream &&
                        `(${data.education.preUniversity.subjectStream})`}
                    </p>
                    {data.education.preUniversity.yearOfPassing && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "rgb(75, 85, 99)",
                        }}
                      >
                        {data.education.preUniversity.yearOfPassing}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "rgb(55, 65, 81)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {data.education.preUniversity.instituteName}
                  </p>
                  {data.education.preUniversity.boardType && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(75, 85, 99)",
                      }}
                    >
                      {data.education.preUniversity.boardType}
                    </p>
                  )}
                </div>
              )}
            {data.education.sslcEnabled &&
              data.education.sslc.instituteName && (
                <div style={{ breakInside: "avoid" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      SSLC / 10th
                    </p>
                    {data.education.sslc.yearOfPassing && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "rgb(75, 85, 99)",
                        }}
                      >
                        {data.education.sslc.yearOfPassing}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "rgb(55, 65, 81)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {data.education.sslc.instituteName}
                  </p>
                  {data.education.sslc.boardType && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(75, 85, 99)",
                      }}
                    >
                      {data.education.sslc.boardType}
                    </p>
                  )}
                </div>
              )}
          </div>
        </div>,
        15
      );
    }

    if (
      data.experience.workExperiences &&
      data.experience.workExperiences.some(
        (exp) => exp.enabled && (exp.companyName || exp.jobTitle)
      )
    ) {
      addRightItem(
        <div key="experience" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
              borderBottom: "1px solid rgb(209, 213, 219)",
              paddingBottom: "0.25rem",
            }}
          >
            Experience
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {data.experience.workExperiences
              .filter((exp) => exp.enabled && (exp.companyName || exp.jobTitle))
              .map((exp, idx) => (
                <div key={exp.id || idx} style={{ breakInside: "avoid" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {exp.jobTitle && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "rgb(17, 24, 39)",
                        }}
                      >
                        {exp.jobTitle}
                      </p>
                    )}
                    {(exp.startDate ||
                      exp.endDate ||
                      exp.currentlyWorking) && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "rgb(75, 85, 99)",
                          whiteSpace: "nowrap",
                          marginLeft: "0.5rem",
                        }}
                      >
                        {exp.startDate && formatMonthYear(exp.startDate)}{" - "}
                        {exp.currentlyWorking
                          ? "Present"
                          : exp.endDate
                          ? formatMonthYear(exp.endDate)
                          : ""}
                      </span>
                    )}
                  </div>
                  {exp.companyName && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(55, 65, 81)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {exp.companyName}
                      {exp.location && ` | ${exp.location}`}
                    </p>
                  )}
                  {(exp.employmentType || exp.workMode) && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(75, 85, 99)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {exp.employmentType}
                      {exp.employmentType && exp.workMode && " • "}
                      {exp.workMode}
                    </p>
                  )}
                  {exp.description && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(75, 85, 99)",
                        lineHeight: "1.5",
                        marginTop: "0.5rem",
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>,
        12 +
          data.experience.workExperiences.filter((exp) => exp.enabled).length *
            4
      );
    }

    if (
      data.projects &&
      data.projects.some((proj) => proj.enabled && proj.projectTitle)
    ) {
      addRightItem(
        <div key="projects" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
              borderBottom: "1px solid rgb(209, 213, 219)",
              paddingBottom: "0.25rem",
            }}
          >
            Projects
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {data.projects
              .filter((proj) => proj.enabled && proj.projectTitle)
              .map((proj, idx) => (
                <div key={proj.id || idx} style={{ breakInside: "avoid" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      {proj.projectTitle}
                    </p>
                    {(proj.startDate ||
                      proj.endDate ||
                      proj.currentlyWorking) && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "rgb(75, 85, 99)",
                          whiteSpace: "nowrap",
                          marginLeft: "0.5rem",
                        }}
                      >
                        {proj.startDate && formatMonthYear(proj.startDate)}{" - "}
                        {proj.currentlyWorking
                          ? "Present"
                          : proj.endDate
                          ? formatMonthYear(proj.endDate)
                          : ""}
                      </span>
                    )}
                  </div>
                  {proj.projectType && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(55, 65, 81)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {proj.projectType}
                    </p>
                  )}
                  {proj.description && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(75, 85, 99)",
                        lineHeight: "1.5",
                        marginTop: "0.25rem",
                      }}
                    >
                      {proj.description}
                    </p>
                  )}
                  {proj.rolesResponsibilities && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "rgb(31, 41, 55)",
                        }}
                      >
                        Roles & Responsibilities:
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "rgb(75, 85, 99)",
                          lineHeight: "1.5",
                        }}
                      >
                        {proj.rolesResponsibilities}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>,
        12 + data.projects.filter((p) => p.enabled).length * 5
      );
    }

    if (
      data.skillsLinks.technicalSummaryEnabled &&
      data.skillsLinks.technicalSummary
    ) {
      addRightItem(
        <div key="technical" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
              borderBottom: "1px solid rgb(209, 213, 219)",
              paddingBottom: "0.25rem",
            }}
          >
            Technical Summary
          </h3>
          <p
            style={{
              fontSize: "0.75rem",
              color: "rgb(75, 85, 99)",
              lineHeight: "1.5",
            }}
          >
            {data.skillsLinks.technicalSummary}
          </p>
        </div>,
        8
      );
    }

    if (
      data.certifications &&
      data.certifications.some(
        (cert) => cert.enabled && cert.certificateTitle
      )
    ) {
      addRightItem(
        <div key="certifications" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
              borderBottom: "1px solid rgb(209, 213, 219)",
              paddingBottom: "0.25rem",
            }}
          >
            Certifications
          </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {data.certifications
              .filter((cert) => cert.enabled && cert.certificateTitle)
              .map((cert, idx) => (
                <div key={cert.id || idx} style={{ breakInside: "avoid" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      {cert.certificateTitle}
                    </p>
                    {cert.date && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "rgb(75, 85, 99)",
                        }}
                      >
                        {formatMonthYear(cert.date)}
                      </span>
                    )}
                  </div>
                  {cert.providedBy && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(55, 65, 81)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {cert.providedBy}
                      {cert.domain && ` • ${cert.domain}`}
                    </p>
                  )}
                  {cert.certificateType && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(75, 85, 99)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Type: {cert.certificateType}
                    </p>
                  )}
                  {cert.description && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(75, 85, 99)",
                        lineHeight: "1.5",
                      }}
                    >
                      {cert.description}
                    </p>
                  )}
                  {cert.certificateUrl && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgb(37, 99, 235)",
                        marginTop: "0.25rem",
                        wordBreak: "break-word",
                      }}
                    >
                      {cert.certificateUrl}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>,
        10 + data.certifications.filter((c) => c.enabled).length * 4
      );
    }

    if (
      data.skillsLinks.linksEnabled &&
      data.skillsLinks.links.publicationEnabled &&
      data.skillsLinks.links.publicationUrl
    ) {
      addRightItem(
        <div key="publications" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
              borderBottom: "1px solid rgb(209, 213, 219)",
              paddingBottom: "0.25rem",
            }}
          >
            Publications
          </h3>
          <div style={{ fontSize: "0.75rem" }}>
            <p
              style={{
                color: "rgb(37, 99, 235)",
                wordBreak: "break-word",
                marginBottom: "0.25rem",
              }}
            >
              {data.skillsLinks.links.publicationUrl}
            </p>
            {data.skillsLinks.links.publicationDescription && (
              <p
                style={{ color: "rgb(75, 85, 99)", lineHeight: "1.5" }}
              >
                {data.skillsLinks.links.publicationDescription}
              </p>
            )}
          </div>
        </div>,
        6
      );
    }

    if (
      data.personal.dateOfBirth ||
      data.personal.nationality ||
      data.personal.passportNumber
    ) {
      addRightItem(
        <div key="personaldetails" style={{ breakInside: "avoid" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "rgb(17, 24, 39)",
              borderBottom: "1px solid rgb(209, 213, 219)",
              paddingBottom: "0.25rem",
            }}
          >
            Personal Details
          </h3>
          <div
            style={{
              gap: "0.25rem",
              display: "flex",
              flexDirection: "column",
              fontSize: "0.75rem",
              color: "rgb(55, 65, 81)",
            }}
          >
            {data.personal.dateOfBirth && (
              <p>
                <span style={{ fontWeight: "600" }}>Date of Birth:</span>{" "}
                {new Date(data.personal.dateOfBirth).toLocaleDateString()}
              </p>
            )}
            {data.personal.gender && (
              <p>
                <span style={{ fontWeight: "600" }}>Gender:</span>{" "}
                {data.personal.gender}
              </p>
            )}
            {data.personal.nationality && (
              <p>
                <span style={{ fontWeight: "600" }}>Nationality:</span>{" "}
                {data.personal.nationality}
              </p>
            )}
            {data.personal.passportNumber && (
              <p>
                <span style={{ fontWeight: "600" }}>Passport:</span>{" "}
                {data.personal.passportNumber}
              </p>
            )}
          </div>
        </div>,
        8
      );
    }

    // Final page
    if (currentLeftItems.length > 0 || currentRightItems.length > 0) {
      pagesArray.push({
        leftContent: currentLeftItems,
        rightContent: currentRightItems,
      });
    }

    return {
      pages:
        pagesArray.length > 0
          ? pagesArray
          : [{ leftContent: [], rightContent: [] }],
      totalPages: pagesArray.length > 0 ? pagesArray.length : 1,
    };
  }, [data, address, fullName, getJobTitle]);

  const renderPage = () => {
    const page = pages[currentPage];
    if (!page) return null;

    return (
      <div
        style={{
          width: "210mm",
          height: "297mm",
          backgroundColor: "white",
          margin: "0 auto",
          boxShadow: "0 0 8px rgba(0,0,0,0.15)",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* LEFT COLUMN */}
        <div
          style={{
            width: "35%",
            backgroundColor: "#F5E6D3",
            padding: "1.5rem",
            boxSizing: "border-box",
            height: "297mm",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            {page.leftContent}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div
          style={{
            width: "65%",
            padding: "1.5rem",
            boxSizing: "border-box",
            height: "297mm",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            {page.rightContent}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        alignItems: "center",
        padding: "1.5rem",
      }}
    >
      {/* ✅ Added PDF download (react-pdf auto-pagination) */}
      <div style={{ marginBottom: "1rem" }}>
        <PDFDownloadLink
          document={<ResumePDF data={data} />}
          fileName="resume.pdf"
        >
          {({ loading }) =>
            loading ? "Generating PDF..." : "Download PDF (A4, auto page break)"
          }
        </PDFDownloadLink>
      </div>

      {/* Current Page Display */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {renderPage()}
      </div>

      {/* Page Navigation Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginTop: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
          style={{
            padding: "0.5rem 0.75rem",
            backgroundColor: currentPage === 0 ? "#d1d5db" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: currentPage === 0 ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            fontWeight: "600",
          }}
        >
          First
        </button>

        <button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          style={{
            padding: "0.5rem 0.75rem",
            backgroundColor: currentPage === 0 ? "#d1d5db" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: currentPage === 0 ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            fontWeight: "600",
          }}
        >
          ← Prev
        </button>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                padding: "0.5rem 0.75rem",
                backgroundColor:
                  currentPage === i ? "#1f2937" : "#e5e7eb",
                color: currentPage === i ? "white" : "rgb(55, 65, 81)",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: currentPage === i ? "700" : "600",
                minWidth: "2.5rem",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
          }
          disabled={currentPage === totalPages - 1}
          style={{
            padding: "0.5rem 0.75rem",
            backgroundColor:
              currentPage === totalPages - 1 ? "#d1d5db" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor:
              currentPage === totalPages - 1 ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            fontWeight: "600",
          }}
        >
          Next →
        </button>

        <button
          onClick={() => setCurrentPage(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          style={{
            padding: "0.5rem 0.75rem",
            backgroundColor:
              currentPage === totalPages - 1 ? "#d1d5db" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor:
              currentPage === totalPages - 1 ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            fontWeight: "600",
          }}
        >
          Last
        </button>

        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "rgb(55, 65, 81)",
            marginLeft: "0.5rem",
          }}
        >
          Page {currentPage + 1} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default ModernProfessionalTemplate;
