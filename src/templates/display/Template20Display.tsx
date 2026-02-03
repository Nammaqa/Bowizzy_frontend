import React from 'react';
import DOMPurify from 'dompurify';
import type { ResumeData } from '@/types/resume';

interface Template20DisplayProps { data: ResumeData }

const htmlToLines = (s?: string) => {
  if (!s) return [] as string[];
  try {
    const text = String(s)
      .replace(/<br\s*\/?/gi, '\n')
      .replace(/<\/p>|<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');
    return text.split(/\n|\r\n/).map(l => l.trim()).filter(Boolean);
  } catch (e) { return [String(s)]; }
};

const formatMonthYear = (s?: string) => {
  if (!s) return '';
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  try {
    const str = String(s).trim();
    const ymd = str.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);
    if (ymd) return `${months[parseInt(ymd[2],10)-1]} ${ymd[1]}`;
    const mY = str.match(/^(\d{2})\/(\d{4})$/);
    if (mY) return `${months[parseInt(mY[1],10)-1]} ${mY[2]}`;
  } catch (e) {}
  const yr = String(s).match(/(\d{4})/)?.[1];
  return yr || String(s);
};

const Template20Display: React.FC<Template20DisplayProps> = ({ data }) => {
  const { personal, experience, education, certifications, skillsLinks } = data;

  const formatMobile = (m?: string) => {
    if (!m) return '';
    const trimmed = String(m).trim();
    if (/^\+/.test(trimmed)) return trimmed;
    if ((personal.country || '').toLowerCase() === 'india') return `+91 ${trimmed}`;
    return trimmed;
  };

  const formatYear = (s?: string) => {
    if (!s) return '';
    const y = String(s).match(/(\d{4})/);
    return y ? y[1] : '';
  };

  const contactItems = [personal.mobileNumber && `Phone: ${formatMobile(personal.mobileNumber)}`, personal.email && `Email: ${personal.email}`, personal.address && `Address: ${personal.address}`, skillsLinks && skillsLinks.links && skillsLinks.links.portfolioUrl && `Portfolio: ${skillsLinks.links.portfolioUrl}`].filter(Boolean);

  return (
    <div style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Georgia, serif', background: '#fff', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ paddingBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 28 }}>{personal.firstName} {personal.middleName || ''} {personal.lastName}</h1>
          { (experience && (experience as any).jobRole) && <div style={{ fontSize: 14, color: '#111827', fontFamily: 'monospace' }}>{(experience as any).jobRole}</div> }
        </div>
      </div>

      <div style={{ height: 1, background: '#000', marginBottom: 16 }} />

      <div>
        {/* CONTACT row */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ width: 170, paddingRight: 12, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2 }}>Contact</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12, color: '#111827', lineHeight: 1.6 }}>
              {contactItems.map((c, i) => (<div key={i} style={{ marginBottom: 6 }}>{c}</div>))}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: '#ddd', margin: '12px 0' }} />

        {/* PROFESSIONAL EXPERIENCE row */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ width: 170, paddingRight: 12, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2 }}>Professional Experience</div>
          <div style={{ flex: 1 }}>
            {experience.workExperiences.filter((w:any)=>w.enabled).map((w:any, idx:number)=> (
              <div key={idx} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 700 }}>{w.jobTitle}</div>
                  <div style={{ color: '#000', fontWeight: 400 }}>{w.startDate ? formatMonthYear(w.startDate) : ''} {w.currentlyWorking ? '— Present' : (w.endDate ? `— ${formatMonthYear(w.endDate)}` : '')}</div>
                </div>
                <div style={{ color: '#000', marginTop: 4, fontWeight: 700 }}>{w.companyName}</div>
                {w.description && (
                  <div style={{ marginTop: 8, color: '#333' }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(w.description || '') }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: '#ddd', margin: '12px 0' }} />

        {/* EDUCATION row */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ width: 170, paddingRight: 12, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2 }}>Education</div>
          <div style={{ flex: 1 }}>
            {education.higherEducationEnabled && education.higherEducation.slice().map((edu:any,i:number)=> (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 800, color: '#000' }}>{edu.degree}{(edu.startYear || edu.endYear) ? ` ${edu.startYear ? formatYear(edu.startYear) : ''} | ${edu.endYear ? formatYear(edu.endYear) : ''}` : ''}</div>
                  <div style={{ color: '#000', fontWeight: 800, fontFamily: "'Times New Roman', Times, serif" }}>{edu.endYear ? `Graduated: ${String(edu.endYear).match(/(\d{4})/)?.[1]}` : ''}</div>
                </div>
                <div style={{ color: '#000', marginTop: 6 }}>{edu.instituteName}</div>
                {edu.resultFormat && edu.result ? (
                  <div style={{ marginTop: 6, color: '#000' }}>{edu.resultFormat}: {edu.result}</div>
                ) : null}
                {edu.description && (
                  <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                    {htmlToLines(edu.description).map((ln, j)=> <li key={j} style={{ marginBottom: 6 }}>{ln}</li>)}
                  </ul>
                )}
              </div>
            ))}

            {(education.preUniversityEnabled || education.preUniversity.instituteName || education.higherEducation.length > 0) && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 800, color: '#000' }}>{education.preUniversity.instituteName || 'Pre University'}</div>
                  <div style={{ color: '#000', fontWeight: 800 }}>{education.preUniversity.yearOfPassing ? formatYear(education.preUniversity.yearOfPassing) : ''}</div>
                </div>
                <div style={{ color: '#000', marginTop: 6 }}>Pre University (12th Standard){education.preUniversity.subjectStream ? ` — ${education.preUniversity.subjectStream}` : ''}</div>
                {education.preUniversity.resultFormat && education.preUniversity.result && (
                  <div style={{ marginTop: 6, color: '#000' }}>{education.preUniversity.resultFormat}: {education.preUniversity.result}</div>
                )}
              </div>
            )}

            {(education.sslcEnabled || education.sslc.instituteName || education.higherEducation.length > 0) && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 800, color: '#000' }}>{education.sslc.instituteName || 'SSLC'}</div>
                  <div style={{ color: '#000', fontWeight: 800 }}>{education.sslc.yearOfPassing ? formatYear(education.sslc.yearOfPassing) : ''}</div>
                </div>
                <div style={{ color: '#000', marginTop: 6 }}>SSLC (10th Standard){education.sslc.boardType ? ` — ${education.sslc.boardType}` : ''}</div>
                {education.sslc.resultFormat && education.sslc.result && (
                  <div style={{ marginTop: 6, color: '#000' }}>{education.sslc.resultFormat}: {education.sslc.result}</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ height: 1, background: '#ddd', margin: '12px 0' }} />

        {/* CERTIFICATES row */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ width: 140, paddingRight: 12, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2 }}>Certificates</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {(certifications || []).filter((c:any)=>c.enabled && c.certificateTitle).map((c:any,i:number)=> (
                <div key={i} style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 700 }}>{c.certificateTitle} {c.year ? `| ${c.year}` : ''}</div>
                  {c.providedBy && <div style={{ color: '#6b7280', marginTop: 4 }}>{c.providedBy}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Template20Display;
