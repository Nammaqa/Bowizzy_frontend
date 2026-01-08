import React from "react";
import DOMPurify from 'dompurify';
import { Document, Page, Text, View, StyleSheet, Svg, Path, Image } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    paddingRight: 24,
    fontSize: 10,
    fontFamily: "Times-Roman",
    backgroundColor: "#ffffff",
  },
  // Header Section
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#6b7280",
    paddingBottom: 16,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameSection: {
    flexDirection: "column",
    flex: 1,
  },
  name: {
    fontSize: 32,
    fontFamily: "Times-Bold",
    color: "#1f2937",
    letterSpacing: 1,
    marginBottom: 0,
  },
  nameDivider: {
    borderBottomWidth: 0,
    width: 0,
  },
  jobTitle: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  verticalSeparator: {
    borderLeftWidth: 1,
    borderLeftColor: "#d1d5db",
    minHeight: 50,
  },
  contactSection: {
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: 9,
    color: "#4b5563",
    minWidth: 180,
  },
  contactItem: {
    marginBottom: 3,
  },
  // Thin and thick header bars used under the header section
  headerThin: {
    height: 1,
    backgroundColor: "#e5e7eb",
    width: "100%",
    marginBottom: 4,
  },
  headerThick: {
    height: 3,
    backgroundColor: "#6b7280",
    width: "100%",
  },
  // Summary Section
  summary: {
    marginBottom: 18,
    textAlign: "justify",
    break: true,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    color: "#2d3748",
    textAlign: "center",
    letterSpacing: 3,
    marginBottom: 10,
    break: true,
  },
  summaryText: {
    fontSize: 10,
    color: "#4a5568",
    lineHeight: 1.6,
    textAlign: "justify",
    break: true,
  },
  // Two Column Layout
  twoColumn: {
    flexDirection: "row",
    gap: 40,
  },
  leftColumn: {
    width: "48%",
  },
  rightColumn: {
    width: "48%",
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    paddingLeft: 12,
  },
  // Section Styles
  section: {
    marginBottom: 20,
    break: true,
    wrap: false,
    // Ensure at least some space ahead before breaking a section to avoid orphaned headers
    minPresenceAhead: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Times-Bold",
    color: "#2d3748",
    letterSpacing: 1.5,
    marginBottom: 10,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e0",
  },
  // Education Items
  educationItem: {
    marginBottom: 12,
    break: true,
    wrap: false,
  },
  itemTitle: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    color: "#2d3748",
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 9,
    color: "#4a5568",
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 8,
    color: "#718096",
  },
  itemResult: {
    fontSize: 9,
    color: "#4a5568",
    marginTop: 4,
  },
  // Skills List
  skillsList: {
    paddingLeft: 0,
    break: true,
    wrap: true,
  },
  skillsText: {
    fontSize: 9,
    color: "#4a5568",
    lineHeight: 1.3,
    textAlign: "left",
    paddingLeft: 10,
  },
  skillItem: {
    fontSize: 10,
    color: "#4a5568",
    marginBottom: 5,
    paddingLeft: 10,
    flexDirection: "row",
  },
  bullet: {
    width: 8,
    textAlign: 'right',
    marginRight: 6,
    marginTop: 2,
    fontSize: 8,
    color: '#4a5568',
  },
  // Certifications
  certificationItem: {
    marginBottom: 7,
    break: true,
    wrap: false,
  },
  certTitle: {
    fontSize: 9,
    fontFamily: "Times-Bold",
    color: "#2d3748",
    marginBottom: 2,
  },
  certProvider: {
    fontSize: 8,
    color: "#718096",
    paddingLeft: 10,
  },
  certDescription: {
    fontSize: 8,
    color: "#4a5568",
    paddingLeft: 10,
  },
  // Work Experience
  workItem: {
    marginBottom: 14,
    break: true,
    wrap: false,
  },
  workTitle: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    color: "#2d3748",
    marginBottom: 2,
  },
  workCompany: {
    fontSize: 9,
    color: "#4a5568",
    fontStyle: "italic",
    marginBottom: 4,
  },
  workDescription: {
    marginTop: 5,
  },
  workDescItem: {
    fontSize: 8,
    color: "#4a5568",
    marginBottom: 3,
    paddingLeft: 10,
    flexDirection: "row",
    lineHeight: 1.4,
    textAlign: "justify",
  },
  // Projects
  projectItem: {
    marginBottom: 12,
    break: true,
    wrap: false,
  },
  projectTitle: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    color: "#2d3748",
    marginBottom: 2,
  },
  projectDate: {
    fontSize: 8,
    color: "#718096",
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 8,
    color: "#4a5568",
    lineHeight: 1.4,
    marginTop: 3,
    textAlign: "justify",
  },
  projectRolesResponsibilities: {
    flex: 1,
    fontSize: 8,
    color: "#4a5568",
    lineHeight: 1.4,
    marginTop: 0,
    textAlign: "justify",
  },
  // Technical Summary
  technicalText: {
    fontSize: 8,
    color: "#4a5568",
    lineHeight: 1.5,
    textAlign: "justify",
    break: true,
    wrap: false,
  },
});

interface Template1PDFProps {
  data: ResumeData;
}

export const Template1PDF: React.FC<Template1PDFProps> = ({ data }) => {
  const {
    personal,
    education,
    experience,
    projects,
    skillsLinks,
    certifications,
  } = data;

  const htmlToPlainText = (html?: string) => {
    if (!html) return '';
    const sanitized = DOMPurify.sanitize(html || '');
    const withBreaks = sanitized.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>|<\/li>/gi, '\n');
    try {
      if (typeof document !== 'undefined') {
        const tmp = document.createElement('div');
        tmp.innerHTML = withBreaks;
        return (tmp.textContent || tmp.innerText || '').trim();
      }
    } catch (e) {
      return withBreaks.replace(/<[^>]+>/g, '').trim();
    }
    return withBreaks.replace(/<[^>]+>/g, '').trim();
  };
  const ICON_PATHS: Record<string, string> = {
    phone: 'M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 3.5A1 1 0 013 2.5H6.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.2 2.2z',
    mail: 'M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    location: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z',
  };

  const renderBulletedParagraph = (html?: string, textStyle?: any) => {
    if (!html) return null;
    const text = htmlToPlainText(html);
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    return lines.map((line, i) => (
      <Text key={i} style={textStyle}>
        {'\u2022 '}{line}
      </Text>
    ));
  };  const getYear = (s?: string) => (s ? s.split('-')[0] : '');
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={styles.nameSection}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {personal.profilePhotoUrl && (
                  <Image src={personal.profilePhotoUrl} style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover' }} />
                )}
                <View>
                  <Text style={styles.name}>
                    {(personal.firstName || '').toUpperCase()} {(personal.middleName || '').toUpperCase()} {(personal.lastName || '').toUpperCase()}
                  </Text>
                  <View style={styles.nameDivider} />
                  <Text style={styles.jobTitle}>{experience.jobRole || "Executive Secretary"}</Text>
                </View>
              </View>
            </View>

            <View style={styles.contactSection}>
              {personal.mobileNumber && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Svg width={10} height={10} viewBox="0 0 24 24"><Path d={ICON_PATHS.phone} fill="#4b5563" /></Svg>
                  <Text style={[styles.contactItem, { marginLeft: 6 }]}>{personal.mobileNumber}</Text>
                </View>
              )}
              {personal.email && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Svg width={10} height={10} viewBox="0 0 24 24"><Path d={ICON_PATHS.mail} fill="#4b5563" /></Svg>
                  <Text style={[styles.contactItem, { marginLeft: 6 }]}>{personal.email}</Text>
                </View>
              )}
              {personal.address && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Svg width={10} height={10} viewBox="0 0 24 24"><Path d={ICON_PATHS.location} fill="#4b5563" /></Svg>
                  <Text style={[styles.contactItem, { marginLeft: 6 }]}>{personal.address}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Hairline + thick bar (ensure spacing to avoid overlap) */}
          <View style={{ marginTop: 14 }}>
            <View style={styles.headerThin} />
            <View style={styles.headerThick} />
          </View>
        </View>

        {/* Summary */}
        {personal.aboutCareerObjective && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>SUMMARY</Text>
            <View style={{ width: 260, height: 2, backgroundColor: '#cbd5e0', marginTop: 6, marginBottom: 10, alignSelf: 'center' }} />
            {renderBulletedParagraph(personal.aboutCareerObjective, styles.summaryText)}
          </View>
        )}

        {/* Two Column Layout */}
        <View style={styles.twoColumn}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Education */}
            {education.higherEducationEnabled &&
              education.higherEducation.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>EDUCATION</Text>

                          {/* Higher Education */}
                          {education.higherEducation.map((edu, idx) => (
                    <View key={idx} style={styles.educationItem}>
                      <Text style={styles.itemTitle}>{edu.instituteName}</Text>
                      <Text style={styles.itemSubtitle}>{edu.degree}</Text>
                      <Text style={styles.itemDate}>
                        {getYear(edu.startYear)} -{" "}
                        {edu.currentlyPursuing ? "Present" : getYear(edu.endYear)}
                      </Text>
                      {edu.resultFormat && edu.result && (
                        <Text style={styles.itemResult}>{`${edu.resultFormat}: ${edu.result}`}</Text>
                      )}
                    </View>
                  ))}
                          {/* Pre-University (show consistent label and same order as display) */}
                          {education.preUniversityEnabled && education.preUniversity.instituteName && (
                            <View style={styles.educationItem}>
                              <Text style={styles.itemTitle}>Pre University</Text>
                              <Text style={styles.itemSubtitle}>{education.preUniversity.instituteName}</Text>
                              <Text style={styles.itemDate}>{getYear(education.preUniversity.yearOfPassing)}</Text>
                              {education.preUniversity.resultFormat && education.preUniversity.result && (
                                <Text style={styles.itemResult}>{`${education.preUniversity.resultFormat}: ${education.preUniversity.result}`}</Text>
                              )}
                            </View>
                          )}

                          {/* SSLC */}
                          {education.sslcEnabled && education.sslc.instituteName && (
                            <View style={styles.educationItem}>
                              <Text style={styles.itemTitle}>SSLC</Text>
                              <Text style={styles.itemSubtitle}>{education.sslc.instituteName}</Text>
                              <Text style={styles.itemDate}>{getYear(education.sslc.yearOfPassing)}</Text>
                              {education.sslc.resultFormat && education.sslc.result && (
                                <Text style={styles.itemResult}>{`${education.sslc.resultFormat}: ${education.sslc.result}`}</Text>
                              )}
                            </View>
                          )}
                </View>
              )}

            {/* Skills (render directly below Education) */}
            {skillsLinks.skills.length > 0 &&
              skillsLinks.skills.some((s) => s.enabled && s.skillName) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>SKILLS</Text>
                  <View style={styles.skillsList}>
                    <Text style={styles.skillsText}>
                      {skillsLinks.skills
                        .filter((s) => s.enabled && s.skillName)
                        .map((skill) => `• ${skill.skillName}`)
                        .join("\n")}
                    </Text>
                  </View>
                </View>
              )}

            {/* Skills (moved to right column) */}

            {/* Certifications */}
            {certifications.length > 0 &&
              certifications.some((c) => c.enabled && c.certificateTitle) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                  {certifications
                    .filter((c) => c.enabled && c.certificateTitle)
                    .map((cert, idx) => (
                      <View key={idx} style={styles.certificationItem}>
                        <Text style={styles.certTitle}>
                          • {cert.certificateTitle}
                        </Text>
                        {cert.providedBy && (
                          <Text style={styles.certProvider}>
                            {cert.providedBy} {cert.date && `- ${cert.date}`}
                          </Text>
                        )}
                        {cert.description && cert.description.trim() !== "" && (
                          <Text style={styles.certDescription}>
                            {htmlToPlainText(cert.description)}
                          </Text>
                        )}
                      </View>
                    ))}
                </View>
              )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Professional Experience */}
            {experience.workExperiences.length > 0 &&
              experience.workExperiences.some((exp) => exp.enabled) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    PROFESSIONAL EXPERIENCE
                  </Text>
                  {experience.workExperiences
                    .filter((exp) => exp.enabled)
                    .map((exp, idx) => (
                      <View key={idx} style={styles.workItem}>
                        <Text style={styles.workTitle}>{exp.jobTitle}</Text>
                        <Text style={styles.workCompany}>
                          {exp.companyName} | {exp.startDate} -{" "}
                          {exp.currentlyWorking ? "Present" : exp.endDate}
                        </Text>
                        {exp.description && (
                          <View style={styles.workDescription}>
                            {htmlToPlainText(exp.description)
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line, i) => (
                                <View key={i} style={styles.workDescItem}>
                                  <Text style={styles.bullet}>•</Text>
                                  <Text>{line}</Text>
                                </View>
                              ))}
                          </View>
                        )}
                      </View>
                    ))}
                </View>
              )}

            {/* Projects */}
            {projects.length > 0 &&
              projects.some((p) => p.enabled && p.projectTitle) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>PROJECTS</Text>
                  {projects
                    .filter((p) => p.enabled && p.projectTitle)
                    .map((project, idx) => (
                      <View key={idx} style={styles.projectItem}>
                        <Text style={styles.projectTitle}>
                          {project.projectTitle}
                        </Text>
                        <Text style={styles.projectDate}>
                          {project.startDate} -{" "}
                          {project.currentlyWorking
                            ? "Present"
                            : project.endDate}
                        </Text>
                        {project.description && (
                          <View style={{ marginTop: 3 }}>
                            <Text style={{ fontFamily: "Times-Bold", fontSize: 8 }}>Description:</Text>
                            {htmlToPlainText(project.description).split("\n").filter(Boolean).map((line, i) => (
                              <Text key={i} style={styles.projectDescription}>{line}</Text>
                            ))}
                          </View>
                        )}
                        {project.rolesResponsibilities && project.rolesResponsibilities.trim() !== "" && (
                          <View style={{ marginTop: 3 }}>
                            <Text style={{ fontFamily: "Times-Bold", fontSize: 8 }}>Roles & Responsibilities:</Text>
                            {htmlToPlainText(project.rolesResponsibilities)
                              .split("\n")
                              .filter(Boolean)
                              .map((line, i) => (
                                <View key={i} style={{ flexDirection: 'row', marginBottom: 2, alignItems: 'flex-start' }}>
                                  <Text style={styles.bullet}>{'\u2022'}</Text>
                                  <View style={{ flex: 1 }}>
                                    <Text style={styles.projectRolesResponsibilities}>{line}</Text>
                                  </View>
                                </View>
                              ))}
                          </View>
                        )}
                      </View>
                    ))}
                </View>
              )}

            {/* Technical Summary */}
            {skillsLinks.technicalSummaryEnabled &&
              skillsLinks.technicalSummary && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>TECHNICAL SUMMARY</Text>
                  {renderBulletedParagraph(skillsLinks.technicalSummary, styles.technicalText)}
                </View>
              )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Template1PDF;
