import React from 'react';
import DOMPurify from 'dompurify';

import type { ResumeData } from '@/types/resume';

interface Template14DisplayProps { data: ResumeData }

const htmlToLines = (s?: string) => {
  if (!s) return [] as string[];
  try {
    const text = String(s)
      .replace(/<\/p>|<\/li>/gi, '\n')
      .replace(/<br\s*\/?>(?:\s*)/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');
    return text.split(/\n|\r\n/).map(l => l.trim()).filter(Boolean);
  } catch (e) { return [String(s)]; }
};

const formatMonthYearNumeric = (s?: string) => {
  if (!s) return '';
  try {
    const str = String(s).trim();
    const ymd = str.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);
    if (ymd) {
      const year = ymd[1];
      const mm = ymd[2];
      return `${mm}/${year}`;
    }
    const mY = str.match(/^(\d{2})\/(\d{4})$/);
    if (mY) {
      return `${mY[1]}/${mY[2]}`;
    }
  } catch (e) {}
  return String(s);
};

const formatYear = (s?: string) => {
  if (!s) return '';
  const str = String(s).trim();
  const y = str.match(/(\d{4})/);
  return y ? y[1] : str;
};

const Template14Display: React.FC<Template14DisplayProps> = ({ data }) => {
  const { personal, experience, education, projects, skillsLinks, certifications } = data;
  // Use the separate jobRole if set by the user; otherwise fall back to first work experience jobTitle
  const profession = (experience && (experience as any).jobRole) || (experience.workExperiences && experience.workExperiences.find((w: any) => w.enabled && w.jobTitle) && experience.workExperiences.find((w: any) => w.enabled && w.jobTitle).jobTitle) || '';

  return (
    <div style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Georgia, serif', background: '#fff' }}>
      <div style={{ padding: '28px 36px 8px 36px' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ margin: 0, marginBottom: 6, fontSize: 30, color: '#b91c1c', fontWeight: 800, lineHeight: 1 }}>{personal.firstName} {(personal.middleName || '')} {personal.lastName}</h1>
          {profession && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{profession}</div>}
          <div style={{ marginTop: 6, fontSize: 11, color: '#6b7280' }}>
            {(() => {
              const contactParts = [personal.address && String(personal.address).split(',')[0], personal.email, personal.mobileNumber].filter(Boolean);
              const linkedin = (skillsLinks && (skillsLinks as any).links && (skillsLinks as any).links.linkedinProfile) || (personal as any).linkedinProfile;
              const github = (skillsLinks && (skillsLinks as any).links && (skillsLinks as any).links.githubProfile) || (personal as any).githubProfile;
              return (
                <>
                  <span>{contactParts.join(' | ')}</span>
                  {(linkedin || github) && <span> | </span>}
                  {linkedin && <a href={(skillsLinks as any).links?.linkedinProfile || (personal as any).linkedinProfile} target="_blank" rel="noreferrer" style={{ color: '#0a66c2', textDecoration: 'none' }}>{linkedin}</a>}
                  {linkedin && github && <span> | </span>}
                  {github && <a href={(skillsLinks as any).links?.githubProfile || (personal as any).githubProfile} target="_blank" rel="noreferrer" style={{ color: '#111', textDecoration: 'none' }}>{github}</a>}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 36px 36px 36px' }}>
        <section style={{ display: 'block', gap: '0 16px' }}>

          <div style={{ marginTop: 16 }}>
            <div style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 1.5, color: '#b91c1c', fontWeight: 700 }}>Work Experience</div>
            <div style={{ height: 1, background: '#eee', marginTop: 4, width: '100%' }} />
          </div>

          <div style={{ marginTop: 8 }}>
            {experience.workExperiences.filter(e => e.enabled).map((w, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{w.jobTitle} <span style={{ fontWeight: 600, color: '#111' }}>— {w.companyName}, {w.location || ''}</span></div>
                  <div style={{ fontSize: 11, color: '#111827', fontWeight: 700 }}>{formatMonthYearNumeric(w.startDate)} — {w.currentlyWorking ? 'Present' : formatMonthYearNumeric(w.endDate)}</div>
                </div>
                {w.description && (
                  <div style={{ marginTop: 6, color: '#444', paddingLeft: 10 }}>
                    {htmlToLines(w.description).map((ln, idx) => <div key={idx} style={{ marginTop: 6 }}>• {ln}</div>)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 6 }}>
            <div style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 1.5, color: '#b91c1c', fontWeight: 700 }}>Education</div>
            <div style={{ height: 1, background: '#eee', marginTop: 4, width: '100%' }} />
          </div>

          <div style={{ marginTop: 8 }}>
            {education.higherEducationEnabled && education.higherEducation.slice().sort((a: any,b: any) => {
              const pa = a.degree ? a.degree.toLowerCase() : '';
              const pb = b.degree ? b.degree.toLowerCase() : '';
              return pa.localeCompare(pb);
            }).map((edu, i) => (
              <div key={`he-${i}`} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700 }}>{edu.instituteName}</div>
                  <div style={{ fontSize: 11, color: '#111827', fontWeight: 700 }}>{edu.currentlyPursuing ? 'Present' : formatYear(edu.endYear)}</div>
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{edu.degree}</div>
                {edu.resultFormat && edu.result && (<div style={{ marginTop: 4, color: '#444' }}>{edu.resultFormat}: {edu.result}</div>)}
              </div>
            ))}

            {education.preUniversityEnabled && education.preUniversity && (education.preUniversity.instituteName || education.preUniversity.yearOfPassing) && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700 }}>{education.preUniversity.instituteName || 'Pre University'}</div>
                  <div style={{ fontSize: 11, color: '#111827', fontWeight: 700 }}>{education.preUniversity.yearOfPassing ? formatYear(education.preUniversity.yearOfPassing) : ''}</div>
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Pre University (12th Standard)</div>
                {education.preUniversity.resultFormat && education.preUniversity.result && (<div style={{ marginTop: 4, color: '#444' }}>{education.preUniversity.resultFormat}: {education.preUniversity.result}</div>)}
              </div>
            )}

            {education.sslcEnabled && education.sslc && (education.sslc.instituteName || education.sslc.yearOfPassing) && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700 }}>{education.sslc.instituteName || 'SSLC'}</div>
                  <div style={{ fontSize: 11, color: '#111827', fontWeight: 700 }}>{education.sslc.yearOfPassing ? formatYear(education.sslc.yearOfPassing) : ''}</div>
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>SSLC (10th Standard)</div>
                {education.sslc.resultFormat && education.sslc.result && (<div style={{ marginTop: 4, color: '#444' }}>{education.sslc.resultFormat}: {education.sslc.result}</div>)}
              </div>
            )}
          </div>

          <div style={{ marginTop: 6 }}>
            <div style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 1.5, color: '#b91c1c', fontWeight: 700 }}>Skills</div>
            <div style={{ height: 1, background: '#eee', marginTop: 4, width: '100%' }} />
          </div>
          <div style={{ marginTop: 6 }}>{skillsLinks.skills.filter(s => s.enabled && s.skillName).map((s,i) => <span key={i} style={{ marginRight: 6 }}>{s.skillName}{i < skillsLinks.skills.filter(s => s.enabled && s.skillName).length - 1 ? ',' : ''}</span>)}</div>

          <div style={{ marginTop: 6 }}>
            <div style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 1.5, color: '#b91c1c', fontWeight: 700 }}>Certifications</div>
            <div style={{ height: 1, background: '#eee', marginTop: 4, width: '100%' }} />
          </div>
          <div style={{ marginTop: 6 }}>{certifications.filter(c => c.enabled && c.certificateTitle).map((c,i) => <span key={i} style={{ marginRight: 6 }}>{c.certificateTitle}{i < certifications.filter(c => c.enabled && c.certificateTitle).length - 1 ? ',' : ''}</span>)}</div>
        
        </section>
      </div>
    </div>
  );
};

export default Template14Display;