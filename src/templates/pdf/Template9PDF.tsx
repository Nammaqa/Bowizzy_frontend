import React from 'react';
import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#222',
  },
  container: {
    flexDirection: 'row',
    width: '100%'
  },
  left: {
    width: '32%',
    paddingRight: 12,
  },
  right: {
    width: '68%',
    paddingLeft: 12,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004b87',
    marginBottom: 4,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  labelText: { fontSize: 10, fontWeight: 'bold', color: '#004b87' },
  labelBar: { width: 26, height: 3, backgroundColor: '#d0d0d0', marginLeft: 8 },
  text: { fontSize: 10, color: '#444', marginBottom: 6 },
  section: { marginBottom: 12 },
  twoColSkills: { flexDirection: 'row' },
  skillsCol: { width: '50%' },
});

interface Template9PDFProps { data: ResumeData }

const Template9PDF: React.FC<Template9PDFProps> = ({ data }) => {
  const { personal, education, experience, skillsLinks, certifications } = data;

  const htmlToText = (s?: string) => {
    if (!s) return '';
    try {
      return String(s).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
    } catch (e) { return s || ''; }
  };

  const skills = skillsLinks.skills.filter((s:any)=>s.enabled && s.skillName).map((s:any)=>s.skillName||'');
  const mid = Math.ceil(skills.length/2);
  const left = skills.slice(0, mid);
  const right = skills.slice(mid);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.left}>
            {personal.profilePhotoUrl && <Image src={personal.profilePhotoUrl} style={styles.photo} />}
            <Text style={styles.name}>{(personal.firstName||'').toUpperCase()} {(personal.lastName||'').toUpperCase()}</Text>
            {experience.jobRole && <Text style={styles.text}>{experience.jobRole}</Text>}

            <View style={styles.section}>
              <View style={styles.labelRow}>
                <Text style={styles.labelText}>Contact</Text>
                <View style={styles.labelBar} />
              </View>
              <Text style={styles.text}>{personal.mobileNumber || ''}</Text>
              <Text style={styles.text}>{personal.email || ''}</Text>
              <Text style={styles.text}>{personal.address || ''}</Text>
            </View>

            {personal.aboutCareerObjective && (
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <Text style={styles.labelText}>About Me</Text>
                  <View style={styles.labelBar} />
                </View>
                <Text style={styles.text}>{htmlToText(personal.aboutCareerObjective)}</Text>
              </View>
            )}

            {skills.length > 0 && (
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <Text style={styles.labelText}>Skills</Text>
                  <View style={styles.labelBar} />
                </View>
                <View style={styles.twoColSkills}>
                  <View style={styles.skillsCol}>{left.map((s,i)=>(<Text key={i} style={styles.text}>• {s}</Text>))}</View>
                  <View style={styles.skillsCol}>{right.map((s,i)=>(<Text key={i} style={styles.text}>• {s}</Text>))}</View>
                </View>
              </View>
            )}

          </View>

          <View style={styles.right}>
            {education.higherEducationEnabled && education.higherEducation.length>0 && (
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <Text style={styles.labelText}>Education</Text>
                  <View style={styles.labelBar} />
                </View>
                {education.higherEducation.map((edu,i)=>(
                  <View key={i} style={{marginBottom:6}}>
                    <Text style={{fontSize:10,fontWeight:'bold'}}>{edu.degree}</Text>
                    <Text style={{fontSize:9,color:'#666'}}>{edu.startYear} - {edu.currentlyPursuing ? 'Present' : edu.endYear}</Text>
                    <Text style={styles.text}>{edu.instituteName}</Text>
                  </View>
                ))}
                {/* Pre University */}
                {education.preUniversityEnabled && education.preUniversity.instituteName && (
                  <View style={{marginBottom:6}}>
                    <Text style={{fontSize:10,fontWeight:'bold'}}>Pre University</Text>
                    <Text style={{fontSize:9,color:'#666'}}>{education.preUniversity.yearOfPassing}</Text>
                    <Text style={styles.text}>{education.preUniversity.instituteName}</Text>
                  </View>
                )}

                {/* SSLC */}
                {education.sslcEnabled && education.sslc.instituteName && (
                  <View style={{marginBottom:6}}>
                    <Text style={{fontSize:10,fontWeight:'bold'}}>SSLC</Text>
                    <Text style={{fontSize:9,color:'#666'}}>{education.sslc.yearOfPassing}</Text>
                    <Text style={styles.text}>{education.sslc.instituteName}</Text>
                  </View>
                )}
              </View>
            )}

            {experience.workExperiences.length>0 && (
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <Text style={styles.labelText}>Experience</Text>
                  <View style={styles.labelBar} />
                </View>
                {experience.workExperiences.filter((w:any)=>w.enabled).map((w:any,i:number)=>(
                  <View key={i} style={{marginBottom:8}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <Text style={{fontSize:10,fontWeight:'bold'}}>{w.jobTitle}</Text>
                      <Text style={{fontSize:9,color:'#666'}}>{w.startDate} - {w.currentlyWorking ? 'Present' : w.endDate}</Text>
                    </View>
                    <Text style={styles.text}>{w.companyName}</Text>
                    {w.description && htmlToText(w.description).split('\n').map((ln,idx)=>ln.trim()? <Text key={idx} style={styles.text}>• {ln.trim()}</Text> : null)}
                  </View>
                ))}
              </View>
            )}

            {certifications.length>0 && (
              <View style={styles.section}>
                <View style={styles.labelRow}>
                  <Text style={styles.labelText}>Certifications</Text>
                  <View style={styles.labelBar} />
                </View>
                {certifications.filter((c:any)=>c.enabled && c.certificateTitle).map((c:any,i:number)=>(
                  <Text key={i} style={styles.text}>• {c.certificateTitle}</Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Template9PDF;
