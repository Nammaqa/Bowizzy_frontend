import React from 'react';
import DOMPurify from 'dompurify';
import type { ResumeData } from '@/types/resume';

interface Template1DisplayProps {
  data: ResumeData;
  showPageBreaks?: boolean;
  supportsPhoto?: boolean;
}

export const Template1Display: React.FC<Template1DisplayProps> = ({
  data,
  showPageBreaks = false,
  supportsPhoto = true,
}) => {
  const { personal, education, experience, projects, skillsLinks, certifications } = data;
  const sortedHigherEducation = React.useMemo(() => {
    const parseYearKey = (val: string) => {
      if (!val) return -Infinity;
      const parts = val.split('-');
      const y = parseInt(parts[0], 10) || 0;
      const m = parseInt(parts[1], 10) || 0;
      return y * 100 + m;
    };

    return [...(education.higherEducation || [])].sort((a, b) => {
      if (a.currentlyPursuing && !b.currentlyPursuing) return -1;
      if (!a.currentlyPursuing && b.currentlyPursuing) return 1;

      const aKey = parseYearKey(a.endYear || a.startYear || '');
      const bKey = parseYearKey(b.endYear || b.startYear || '');

      return bKey - aKey;
    });
  }, [education.higherEducation]);

  return (
    <div className="w-[210mm] bg-white" style={{ minHeight: '297mm', fontFamily: 'Times New Roman, serif' }}>
      {/* Header Section */}
      <div style={{ padding: '25px 40px 20px 40px', borderBottom: '2px solid #6b7280' }}>
        <div className="flex items-start justify-between">
          {/* Left - Name and Title */}
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#1f2937',
              letterSpacing: '1px',
              marginBottom: '2px',
              lineHeight: '1'
            }}>
              {personal.firstName.toUpperCase()} <span style={{ fontWeight: '600' }}>{personal.lastName.toUpperCase()}</span>
            </h1>
            <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '6px', letterSpacing: '0.5px' }}>
              {experience.jobRole}
            </p>
          </div>

          {/* Right - Contact Info */}
          <div style={{ fontSize: '10px', color: '#4b5563', textAlign: 'right', minWidth: '150px' }}>
            <div style={{ marginBottom: '5px' }}>
              {personal.mobileNumber}
            </div>
            <div style={{ marginBottom: '5px' }}>
              {personal.email}
            </div>
            <div>
              {personal.address}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {personal.aboutCareerObjective && (
        <div className="resume-section" style={{ padding: '20px 40px' }}>
          <h2 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#2d3748',
            textAlign: 'center',
            letterSpacing: '3px',
            marginBottom: '12px'
          }}>
            SUMMARY
          </h2>
          {/* Render as sanitized HTML so any editor-generated tags are interpreted correctly */}
          <div style={{ 
            fontSize: '10px', 
            color: '#4a5568', 
            textAlign: 'justify',
            lineHeight: '1.6'
          }}
          // Use dangerouslySetInnerHTML after sanitizing to prevent XSS
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(personal.aboutCareerObjective || '') }}
          />
        </div>
      )}

      {/* Two Column Layout */}
      <div className="flex" style={{ padding: '0 40px 30px 40px', gap: '40px' }}>
        {/* Left Column */}
        <div style={{ width: '48%' }}>
          {/* Education Section */}
          {(education.higherEducationEnabled && education.higherEducation.length > 0) && (
            <div className="resume-section" style={{ marginBottom: '24px' }}>
              <h2 style={{ 
                fontSize: '13px', 
                fontWeight: 'bold', 
                color: '#2d3748',
                letterSpacing: '2px',
                marginBottom: '12px',
                paddingBottom: '4px',
                borderBottom: '1px solid #cbd5e0'
              }}>
                EDUCATION
              </h2>
              {sortedHigherEducation.map((edu, idx) => (
                <div key={idx} className="education-item" style={{ marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#2d3748', marginBottom: '2px' }}>
                    {edu.instituteName || 'Ginyard International Co. University'}
                  </h3>
                  <p style={{ fontSize: '10px', color: '#4a5568', marginBottom: '2px' }}>
                    {edu.degree || 'Bachelor Degree in Business Administration'}
                  </p>
                  <p style={{ fontSize: '9px', color: '#718096' }}>
                    {edu.startYear} - {edu.currentlyPursuing ? 'Present' : (edu.endYear || '2020')}
                  </p>
                </div>
              ))}

              {/* SSLC */}
              {/* Pre-University */}
              {education.preUniversityEnabled && education.preUniversity.instituteName && (
                <div className="education-item" style={{ marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#2d3748', marginBottom: '2px' }}>
                    {education.preUniversity.instituteName}
                  </h3>
                  <p style={{ fontSize: '10px', color: '#4a5568', marginBottom: '2px' }}>
                    Pre University  - {education.preUniversity.boardType}
                  </p>
                  <p style={{ fontSize: '9px', color: '#718096' }}>
                    {education.preUniversity.yearOfPassing}
                  </p>
                </div>
              )}

              {/* SSLC */}
              {education.sslcEnabled && education.sslc.instituteName && (
                <div className="education-item" style={{ marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#2d3748', marginBottom: '2px' }}>
                    {education.sslc.instituteName}
                  </h3>
                  <p style={{ fontSize: '10px', color: '#4a5568', marginBottom: '2px' }}>
                    SSLC - {education.sslc.boardType}
                  </p>
                  <p style={{ fontSize: '9px', color: '#718096' }}>
                    {education.sslc.yearOfPassing}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Skills Section */}
          {skillsLinks.skills.length > 0 && skillsLinks.skills.some(s => s.enabled && s.skillName) && (
            <div className="resume-section" style={{ marginBottom: '24px' }}>
              <h2 style={{ 
                fontSize: '13px', 
                fontWeight: 'bold', 
                color: '#2d3748',
                letterSpacing: '2px',
                marginBottom: '12px',
                paddingBottom: '4px',
                borderBottom: '1px solid #cbd5e0'
              }}>
                SKILLS
              </h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {skillsLinks.skills.filter(s => s.enabled && s.skillName).map((skill, idx) => (
                  <li key={idx} style={{ 
                    fontSize: '10px', 
                    color: '#4a5568',
                    marginBottom: '6px',
                    paddingLeft: '12px',
                    position: 'relative'
                  }}>
                    <span style={{ position: 'absolute', left: '0', top: '0' }}>•</span>
                    {skill.skillName}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications Section */}
          {certifications.length > 0 && certifications.some(c => c.enabled && c.certificateTitle) && (
            <div className="resume-section" style={{ marginBottom: '24px' }}>
              <h2 style={{ 
                fontSize: '13px', 
                fontWeight: 'bold', 
                color: '#2d3748',
                letterSpacing: '2px',
                marginBottom: '12px',
                paddingBottom: '4px',
                borderBottom: '1px solid #cbd5e0',
                textAlign: 'justify'
              }}>
                CERTIFICATIONS
              </h2>
              {certifications.filter(c => c.enabled && c.certificateTitle).map((cert, idx) => (
                <div key={idx} className="certification-item" style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '10px', color: '#2d3748', fontWeight: '600', marginBottom: '2px' }}>
                    • {cert.certificateTitle}
                  </p>
                  {cert.providedBy && (
                    <p style={{ fontSize: '9px', color: '#718096', paddingLeft: '12px' }}>
                      {cert.providedBy} {cert.date && `- ${cert.date}`}
                    </p>
                  )}
                  {cert.description && (
                    <div style={{ paddingLeft: '12px' }}>
                      <div
                        style={{ fontSize: '9px', color: '#718096' }}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cert.description || '') }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ width: '48%' }}>
          {/* Professional Experience Section */}
          {experience.workExperiences.length > 0 && experience.workExperiences.some(exp => exp.enabled) && (
            <div className="resume-section" style={{ marginBottom: '24px' }}>
              <h2 style={{ 
                fontSize: '13px', 
                fontWeight: 'bold', 
                color: '#2d3748',
                letterSpacing: '2px',
                marginBottom: '12px',
                paddingBottom: '4px',
                borderBottom: '1px solid #cbd5e0',
                textAlign: 'justify'
                
              }}>
                PROFESSIONAL EXPERIENCE
              </h2>
              {experience.workExperiences.filter(exp => exp.enabled).map((exp, idx) => (
                <div key={idx} className="work-item" style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#2d3748', marginBottom: '2px' }}>
                    {exp.jobTitle}
                  </h3>
                  <p style={{ fontSize: '10px', color: '#4a5568', fontStyle: 'italic', marginBottom: '4px' }}>
                    {exp.companyName} | {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </p>
                  {exp.description && (
                    <div style={{ margin: '6px 0 0 0', paddingLeft: '12px', lineHeight: '1.4' }}>
                      {/* Render HTML (sanitized) so editor-generated tags like <div>, <ul>, etc. are interpreted correctly */}
                      <div
                        style={{ fontSize: '9px', color: '#4a5568', textAlign: 'justify' }}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(exp.description || '') }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects Section */}
          {projects.length > 0 && projects.some(p => p.enabled && p.projectTitle) && (
            <div className="resume-section" style={{ marginBottom: '24px' }}>
              <h2 style={{ 
                fontSize: '13px', 
                fontWeight: 'bold', 
                color: '#2d3748',
                letterSpacing: '2px',
                marginBottom: '12px',
                paddingBottom: '4px',
                borderBottom: '1px solid #cbd5e0'
              }}>
                PROJECTS
              </h2>
              {projects.filter(p => p.enabled && p.projectTitle).map((project, idx) => (
                <div key={idx} className="project-item" style={{ marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: '#2d3748', marginBottom: '2px' }}>
                    {project.projectTitle}
                  </h3>
                  <p style={{ fontSize: '9px', color: '#718096', marginBottom: '4px' }}>
                    {project.startDate} - {project.currentlyWorking ? 'Present' : project.endDate}
                  </p>
                  {project.description && (
                    <div style={{ marginTop: '4px' }}>
                      <div
                        style={{ fontSize: '9px', color: '#4a5568', lineHeight: '1.4', textAlign: 'justify' }}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.description || '') }}
                      />
                    </div>
                  )}
                  {project.rolesResponsibilities && (
                    <div style={{ marginTop: '4px' }}>
                      <div
                        style={{ fontSize: '9px', color: '#4a5568', lineHeight: '1.4', textAlign: 'justify' }}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`<strong>Roles & Responsibilities:</strong> ${project.rolesResponsibilities || ''}`) }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Technical Summary */}
          {skillsLinks.technicalSummaryEnabled && skillsLinks.technicalSummary && (
            <div className="resume-section" style={{ marginBottom: '24px' }}>
              <h2 style={{ 
                fontSize: '13px', 
                fontWeight: 'bold', 
                color: '#2d3748',
                letterSpacing: '2px',
                marginBottom: '12px',
                paddingBottom: '4px',
                borderBottom: '1px solid #cbd5e0',
                textAlign: 'justify'
              }}>
                TECHNICAL SUMMARY
              </h2>
              <div style={{ fontSize: '9px', color: '#4a5568', lineHeight: '1.5', textAlign: 'justify' }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(skillsLinks.technicalSummary || '') }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template1Display;