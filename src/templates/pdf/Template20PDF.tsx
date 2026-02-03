import React from 'react';
import DOMPurify from 'dompurify';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
  page: { padding: 24, fontFamily: 'Times-Roman', fontSize: 10 },
  header: { marginBottom: 12 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 20, fontFamily: 'Times-Bold' },
  role: { fontSize: 12, fontFamily: 'Times-Roman' },
  dividerThick: { height: 1, backgroundColor: '#000', marginBottom: 12 },
  leftCol: { width: 170, paddingRight: 12 },
  rightCol: { flex: 1 },
  sectionHeading: { fontSize: 11, fontFamily: 'Times-Bold', textTransform: 'uppercase', letterSpacing: 1.2 },
  smallDivider: { height: 1, backgroundColor: '#ddd', marginTop: 6, marginBottom: 8 }
});

const htmlToPlainText = (html?: string) => {
  if (!html) return '';
  const sanitized = DOMPurify.sanitize(html || '');
  const withBreaks = sanitized.replace(/<br\s*\/?/gi, '\n').replace(/<\/p>|<\/li>/gi, '\n');
  const decoded = withBreaks.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  try {
    if (typeof document !== 'undefined') {
      const tmp = document.createElement('div');
      tmp.innerHTML = decoded;
      return (tmp.textContent || tmp.innerText || '').trim();
    }
  } catch (e) { }
  return decoded.replace(/<[^>]+>/g, '').trim();
};

const htmlToLines = (html?: string) => {
  const plain = htmlToPlainText(html);
  if (!plain) return [] as string[];
  return plain.split(/\n|\r\n/).map(l => l.trim()).filter(Boolean);
};

const renderBulletedParagraph = (html?: string) => {
  if (!html) return null;
  const sanitized = DOMPurify.sanitize(html || '');
  let text = sanitized
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
  
  const lines = text.split('\n').filter((l) => l.trim());
  
  return (
    <View style={{ marginTop: 4 }}>
      {lines.map((line, idx) => (
        <View key={idx} style={{ flexDirection: 'row', marginTop: idx > 0 ? 2 : 0 }}>
          <Text style={{ width: 12, flexShrink: 0, color: '#444', fontSize: 10 }}>
            •
          </Text>
          <Text style={{ flex: 1, color: '#444', fontSize: 10 }}>
            {line.startsWith('•') ? line.substring(1).trim() : line}
          </Text>
        </View>
      ))}
    </View>
  );
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

interface Template20PDFProps { data: ResumeData }

const Template20PDF: React.FC<Template20PDFProps> = ({ data }) => {
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
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{personal.firstName} {personal.middleName || ''} {personal.lastName}</Text>
            { (experience && (experience as any).jobRole) && <Text style={styles.role}>{(experience as any).jobRole}</Text> }
          </View>
        </View>

        <View style={styles.dividerThick} />

        {/* CONTACT row */}
        <View style={{ flexDirection: 'row', marginTop: 6 }}>
          <View style={{ width: 150 }}>
            <Text style={styles.sectionHeading}>CONTACT</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                {contactItems.slice(0,2).map((c:any,i:number)=>(<Text key={i} style={{ marginBottom: 4 }}>{c}</Text>))}
              </View>
              <View>
                {contactItems.slice(2).map((c:any,i:number)=>(<Text key={i} style={{ marginBottom: 4 }}>{c}</Text>))}
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: '#ddd', marginTop: 12, marginBottom: 12 }} />

        {/* PROFESSIONAL EXPERIENCE row */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 150 }}><Text style={styles.sectionHeading}>PROFESSIONAL EXPERIENCE</Text></View>
          <View style={{ flex: 1 }}>
            {experience.workExperiences.filter((w:any)=>w.enabled).map((w:any,i:number)=> (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: 'Times-Bold' }}>{w.jobTitle}</Text>
                  <Text style={{ color: '#000' }}>{w.startDate ? formatMonthYear(w.startDate) : ''} {w.currentlyWorking ? '— Present' : (w.endDate ? `— ${formatMonthYear(w.endDate)}` : '')}</Text>
                </View>
                <Text style={{ marginTop: 4, fontFamily: 'Times-Bold', color: '#000' }}>{w.companyName}</Text>
                {w.description && renderBulletedParagraph(w.description)}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: '#ddd', marginTop: 12, marginBottom: 12 }} />

        {/* EDUCATION row */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 150 }}><Text style={styles.sectionHeading}>EDUCATION</Text></View>
          <View style={{ flex: 1 }}>
            {education.higherEducationEnabled && education.higherEducation.slice().map((edu:any,i:number)=> (
              <View key={i} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: 'Times-Bold' }}>{edu.degree}{(edu.startYear || edu.endYear) ? ` ${formatYear(edu.startYear)} | ${formatYear(edu.endYear)}` : ''}</Text>
                  <Text style={{ fontSize: 11, color: '#000', fontFamily: 'Times-Bold' }}>{edu.endYear ? `Graduated: ${formatYear(edu.endYear)}` : ''}</Text>
                </View>
                <Text style={{ fontSize: 11, color: '#000', marginTop: 6 }}>{edu.instituteName}</Text>
                {edu.resultFormat && edu.result ? (
                  <Text style={{ fontSize: 11, color: '#000', marginTop: 6 }}>{edu.resultFormat}: {edu.result}</Text>
                ) : null}
                {edu.description && renderBulletedParagraph(edu.description)}
              </View>
            ))}

            {/* Pre University */}
            {(education.preUniversityEnabled || education.preUniversity.instituteName || education.higherEducation.length > 0) && (
              <View style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: 'Times-Bold' }}>{education.preUniversity.instituteName || 'Pre University'}</Text>
                  <Text style={{ fontSize: 11, color: '#000' }}>{education.preUniversity.yearOfPassing ? formatYear(education.preUniversity.yearOfPassing) : ''}</Text>
                </View>
                <Text style={{ fontSize: 11, color: '#000', marginTop: 6 }}>Pre University (12th Standard){education.preUniversity.subjectStream ? ` — ${education.preUniversity.subjectStream}` : ''}</Text>
                {education.preUniversity.resultFormat && education.preUniversity.result && (
                  <Text style={{ fontSize: 11, color: '#000', marginTop: 6 }}>{education.preUniversity.resultFormat}: {education.preUniversity.result}</Text>
                )}
              </View>
            )}

            {/* SSLC */}
            {(education.sslcEnabled || education.sslc.instituteName || education.higherEducation.length > 0) && (
              <View style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: 'Times-Bold' }}>{education.sslc.instituteName || 'SSLC'}</Text>
                  <Text style={{ fontSize: 11, color: '#000' }}>{education.sslc.yearOfPassing ? formatYear(education.sslc.yearOfPassing) : ''}</Text>
                </View>
                <Text style={{ fontSize: 11, color: '#000', marginTop: 6 }}>SSLC (10th Standard){education.sslc.boardType ? ` — ${education.sslc.boardType}` : ''}</Text>
                {education.sslc.resultFormat && education.sslc.result && (
                  <Text style={{ fontSize: 11, color: '#000', marginTop: 6 }}>{education.sslc.resultFormat}: {education.sslc.result}</Text>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: '#ddd', marginTop: 12, marginBottom: 12 }} />

        {/* CERTIFICATES row */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 140 }}><Text style={styles.sectionHeading}>CERTIFICATES</Text></View>
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: 6, flexDirection: 'row', flexWrap: 'wrap' }}>
              {(certifications || []).filter((c:any)=>c.enabled && c.certificateTitle).map((c:any,i:number)=> (
                <View key={i} style={{ width: '50%', paddingRight: 6, marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'Times-Bold' }}>{c.certificateTitle} {c.year ? `| ${c.year}` : ''}</Text>
                  {c.providedBy && <Text style={{ marginTop: 4 }}>{c.providedBy}</Text>}
                </View>
              ))}
            </View>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export default Template20PDF;
