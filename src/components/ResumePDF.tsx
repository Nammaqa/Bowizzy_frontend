import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";

const styles = StyleSheet.create({
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
  text: {
    fontSize: 10,
    marginBottom: 4,
  },
});

export const ResumePDF = ({ data }: { data: ResumeData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>

        {/* LEFT COLUMN */}
        <View style={styles.left}>
          <Text style={styles.heading}>Contact</Text>
          {data.personal.address && <Text style={styles.text}>{data.personal.address}</Text>}
          {data.personal.email && <Text style={styles.text}>{data.personal.email}</Text>}
          {data.personal.mobileNumber && <Text style={styles.text}>{data.personal.mobileNumber}</Text>}
        </View>

        {/* RIGHT COLUMN */}
        <View style={styles.right}>

          <Text style={{ fontSize: 22, fontWeight: 700 }}>
            {data.personal.firstName} {data.personal.lastName}
          </Text>

          {/* Auto page breaks are handled automatically */}
          <View wrap>
            <Text style={styles.heading}>Education</Text>
            {data.education.higherEducation.map((edu, i) => (
              <View key={i} wrap>
                <Text style={styles.text}>{edu.degree}</Text>
                <Text style={styles.text}>{edu.instituteName}</Text>
              </View>
            ))}
          </View>

          <View wrap>
            <Text style={styles.heading}>Experience</Text>
            {data.experience.workExperiences.map((exp, i) => (
              <View key={i} wrap>
                <Text style={styles.text}>{exp.jobTitle}</Text>
                <Text style={styles.text}>{exp.companyName}</Text>
              </View>
            ))}
          </View>
        </View>

      </Page>
    </Document>
  );
};
