import React from 'react';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import type { ResumeData } from '@/types/resume';

interface Template4DisplayProps {
  data: ResumeData;
}

const SidebarColor = '#0f766e';

const Template4Display: React.FC<Template4DisplayProps> = ({ data }) => {
  const { personal, education, experience, projects, skillsLinks, certifications } = data;

  const htmlToText = (s?: string) => {
    if (!s) return '';
    try {
      let t = String(s)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(div|p|li|section|h[1-6])>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\u00A0/g, ' ')
        .replace(/\n\s+\n/g, '\n')
        .trim();
      return t;
    } catch (e) {
      return s || '';
    }
  };

  const sanitizeLines = (s?: string) => {
    if (!s) return '';
    try {
      return String(s).replace(/^\s*>+\s*/gm, '').trim();
    } catch (e) {
      return s || '';
    }
  };

  return (
    <div className="w-[210mm] bg-white" style={{ minHeight: '297mm', fontFamily: 'Times New Roman, serif' }}>
      <div style={{ display: 'flex', minHeight: '100%', padding: '20px 20px' }}>
        {/* Left Sidebar */}
        <aside style={{ width: '78mm', background: SidebarColor, color: '#ffffff', padding: '28px', boxSizing: 'border-box' }}>
          <div style={{ marginBottom: '18px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '1px' }}>
              {personal.firstName} {(personal.middleName || '')} {personal.lastName}
            </h1>
            <div style={{ height: '6px' }} />
            <p style={{ fontSize: '12px', opacity: 0.95 }}>{experience.jobRole}</p>
          </div>



          <div style={{ marginTop: 18 }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, marginBottom: 8 }}>Languages</h3>
            <div style={{ fontSize: 11, lineHeight: '1.4' }}>
              {personal.languagesKnown && personal.languagesKnown.length > 0 ? (
                <ul style={{ paddingLeft: 14, margin: 0, fontSize: 11, lineHeight: '1.4' }}>
                  {personal.languagesKnown.map((lang, idx) => (
                    <li key={idx}>{lang}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: 11, color: '#e6edf0' }}>No languages added</div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <h3 style={{ fontSize: '12px', fontWeight: 700, marginBottom: 8 }}>Certifications</h3>
            <div style={{ fontSize: 11, lineHeight: '1.4' }}>
              {certifications && certifications.filter(c => c.enabled).length > 0 ? (
                certifications.filter(c => c.enabled).map((c, idx) => {
                  const start = (c as any).startDate;
                  const end = (c as any).endDate;
                  const single = c.date;
                  const dateRange = start && end ? `${start} - ${end}` : (single ? single : '');
                  return (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#ffffff' }}>{c.certificateTitle || 'Certificate'}</div>
                      {dateRange ? <div style={{ fontSize: 10, color: '#e6edf0', fontStyle: 'italic', marginTop: 2 }}>{dateRange}</div> : null}
                      {c.description ? <div style={{ fontSize: 11, color: '#ffffff', marginTop: 6, whiteSpace: 'pre-wrap' }}>{htmlToText(c.description)}</div> : null}
                    </div>
                  );
                })
              ) : (
                <div style={{ fontSize: 11, color: '#e6edf0' }}>No certifications added</div>
              )}
            </div>
          </div>

          {/* Passions: data model currently does not include a separate passions field.
              Avoid mirroring the summary here to prevent duplicate content. If you
              have a dedicated `personal.passions` field later, replace the block
              below to render that. */}
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, background: '#ffffff', padding: '28px', boxSizing: 'border-box' }}>
          {/* Header: job role on its own line, contact items in a single formatted line */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f766e', marginBottom: 8 }}>
              {experience.jobRole}
            </div>
            <div style={{ fontSize: 12, color: '#4a5568', lineHeight: 1.6, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              {personal.mobileNumber && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <FiPhone color="#4a5568" size={14} />
                  <span>{personal.mobileNumber}</span>
                </span>
              )}
              {personal.email && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <FiMail color="#4a5568" size={14} />
                  <span>{personal.email}</span>
                </span>
              )}
              {personal.address && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <FiMapPin color="#4a5568" size={14} />
                  <span>{personal.address.split(',')[0]}</span>
                </span>
              )}
              {((skillsLinks && skillsLinks.links && skillsLinks.links.linkedinProfile) || (personal as any).linkedinProfile) && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>LinkedIn Profile</span>
              )}
            </div>
          </div>

          {/* Summary */}
          {personal.aboutCareerObjective && (
            <section style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: '#2d3748', letterSpacing: '2px', textAlign: 'left', marginBottom: 8 }}>SUMMARY</h2>
              <p style={{ fontSize: 11, color: '#4a5568', lineHeight: 1.6, textAlign: 'justify' }}>{htmlToText(personal.aboutCareerObjective)}</p>
            </section>
          )}

          {/* Experience */}
          {experience.workExperiences.length > 0 && (
            <section style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: '#2d3748', letterSpacing: '2px', marginBottom: 8 }}>EXPERIENCE</h2>
              {experience.workExperiences.filter(w => w.enabled).map((w, i) => (
                <div key={i} className="avoid-break">
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#2d3748' }}>{w.jobTitle}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: '#4a5568', fontStyle: 'italic' }}>{w.companyName}</div>
                    <div style={{ fontSize: 11, color: '#4a5568', fontStyle: 'italic' }}>{w.startDate} - {w.currentlyWorking ? 'Present' : w.endDate}</div>
                  </div>
                  {w.description && <p style={{ fontSize: 11, color: '#4a5568', marginTop: 6, textAlign: 'justify', whiteSpace: 'pre-wrap' }}>{htmlToText(w.description)}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Projects (render right after EXPERIENCE; useful for freshers with no work experience) */}
          {projects && projects.length > 0 && projects.some(p => p.enabled && p.projectTitle) && (
            <section style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: '#2d3748', letterSpacing: '2px', marginBottom: 8 }}>PROJECTS</h2>
              {projects.filter(p => p.enabled && p.projectTitle).map((project, idx) => (
                    <div key={idx} className="avoid-break">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#2d3748' }}>{project.projectTitle}</div>
                    <div style={{ fontSize: 11, color: '#4a5568' }}>{project.startDate} - {project.currentlyWorking ? 'Present' : project.endDate}</div>
                  </div>
                  {project.description && (
                    <p style={{ fontSize: 11, color: '#4a5568', marginTop: 6, textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
                      <strong>Description:</strong> {sanitizeLines(htmlToText(project.description))}
                    </p>
                  )}
                  {project.rolesResponsibilities && (
                    <p style={{ fontSize: 11, color: '#4a5568', marginTop: 6, textAlign: 'justify' }}>
                      <strong>Roles & Responsibilities:</strong> {sanitizeLines(htmlToText(project.rolesResponsibilities))}
                    </p>
                  )}
                </div>
              ))} 
            </section>
          )}

          {/* Education */}
          {education.higherEducationEnabled && education.higherEducation.length > 0 && (
            <section style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: '#2d3748', letterSpacing: '2px', marginBottom: 8 }}>EDUCATION</h2>
              {education.higherEducation.map((edu, idx) => (
                 <div key={idx} className="avoid-break">
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{edu.instituteName}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: '#4a5568' }}>{edu.degree}</div>
                    <div style={{ fontSize: 11, color: '#4a5568' }}>{edu.startYear} - {edu.currentlyPursuing ? 'Present' : edu.endYear}</div>
                  </div>
                </div>
              ))}
              {/* Pre University */}
              {education.preUniversityEnabled && education.preUniversity.instituteName && (
                <div className="avoid-break" style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{education.preUniversity.instituteName}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: '#4a5568' }}>Pre University - {education.preUniversity.boardType}</div>
                    <div style={{ fontSize: 11, color: '#4a5568' }}>{education.preUniversity.yearOfPassing}</div>
                  </div>
                </div>
              )}

              {/* SSLC */}
              {education.sslcEnabled && education.sslc.instituteName && (
                <div className="avoid-break" style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{education.sslc.instituteName}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 11, color: '#4a5568' }}>SSLC - {education.sslc.boardType}</div>
                    <div style={{ fontSize: 11, color: '#4a5568' }}>{education.sslc.yearOfPassing}</div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Skills */}
          {skillsLinks.skills.length > 0 && (
            <section style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: '#2d3748', letterSpacing: '2px', marginBottom: 8 }}>SKILLS</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skillsLinks.skills.filter(s => s.enabled && s.skillName).map((s, i) => (
                  <span key={i} style={{ fontSize: 11, color: '#4a5568', padding: '6px 10px', border: '1px solid #e6edf0', borderRadius: 4 }}>{s.skillName}</span>
                ))}
              </div>
            </section>
          )}


        </main>
      </div>
    </div>
  );
};
export default Template4Display;
