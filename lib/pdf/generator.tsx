import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { Proposal, AgencySettings } from '@/lib/types'

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'Helvetica',
    backgroundColor: '#F7F6F2',
    color: '#14213D',
  },
  header: {
    borderBottom: '2px solid #14213D',
    paddingBottom: 16,
    marginBottom: 32,
  },
  agencyName: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  letterheadRule: {
    borderTop: '1px solid #14213D',
    marginTop: 4,
    paddingTop: 4,
    borderBottom: '1px solid #14213D',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  table: {
    marginTop: 16,
    borderTop: '1px solid #14213D',
    borderBottom: '1px solid #14213D',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #E5E5E5',
    paddingVertical: 8,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    color: '#6B7280',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E5E5E5',
    paddingVertical: 8,
    fontSize: 10,
  },
  tableFooter: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTop: '2px solid #14213D',
    marginTop: 4,
  },
  col1: { width: '25%' },
  col2: { width: '30%' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '15%', textAlign: 'right' },
  col5: { width: '15%', textAlign: 'right' },
  totalLabel: {
    width: '70%',
    textAlign: 'right',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  totalValue: {
    width: '30%',
    textAlign: 'right',
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 60,
    right: 60,
    textAlign: 'center',
    fontSize: 9,
    color: '#6B7280',
    borderTop: '1px solid #E5E5E5',
    paddingTop: 12,
  },
})

interface PDFDocumentProps {
  proposal: Proposal
  settings: AgencySettings
}

function PDFDocument({ proposal, settings }: PDFDocumentProps) {
  const totalValue = proposal.pricing.reduce((sum, item) => sum + item.total, 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.agencyName}>{settings.name}</Text>
          {settings.website && (
            <Text style={{ fontSize: 10, color: '#6B7280' }}>{settings.website}</Text>
          )}
        </View>

        {/* Sections */}
        {proposal.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.content_md.split('\n\n').map((paragraph, pIndex) => (
              <Text key={pIndex} style={styles.sectionContent}>
                {paragraph.replace(/[*#]/g, '').trim()}
              </Text>
            ))}
          </View>
        ))}

        {/* Pricing table */}
        {proposal.pricing.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investment</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.col1}>Item</Text>
                <Text style={styles.col2}>Description</Text>
                <Text style={styles.col3}>Qty</Text>
                <Text style={styles.col4}>Price</Text>
                <Text style={styles.col5}>Total</Text>
              </View>
              {proposal.pricing.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.col1}>{item.item}</Text>
                  <Text style={styles.col2}>{item.description}</Text>
                  <Text style={styles.col3}>{item.qty}</Text>
                  <Text style={styles.col4}>
                    {settings.currency}{item.unit_price.toLocaleString()}
                  </Text>
                  <Text style={styles.col5}>
                    {settings.currency}{item.total.toLocaleString()}
                  </Text>
                </View>
              ))}
              <View style={styles.tableFooter}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {settings.currency}{totalValue.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{settings.name}</Text>
          {proposal.valid_until && (
            <Text>
              Valid until {new Date(proposal.valid_until).toLocaleDateString()}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  )
}

export async function generatePDF(proposal: Proposal, settings: AgencySettings): Promise<Buffer> {
  const doc = <PDFDocument proposal={proposal} settings={settings} />
  const asPdf = pdf()
  asPdf.updateContainer(doc)
  const blob = await asPdf.toBlob()
  return Buffer.from(await blob.arrayBuffer())
}
