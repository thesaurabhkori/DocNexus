/**
 * Universal SaaS Tool Context Mapping Configuration Matrix
 * Maps brand themes, extensions, and network parameters dynamically
 */
export const TOOL_CONFIGS = {
  'word-to-pdf': {
    title: 'Word to PDF',
    subTitle: 'Convert Word documents to PDF.',
    fileTypeLabel: 'DOCX',
    outputExt: 'pdf',
    accentColor: '#1F51FF', // Indigo Blue
    bgGradient: 'from-indigo-600 to-blue-500',
    themeClass: 'text-[#1F51FF] bg-blue-50 border-blue-100',
    acceptTypes: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    endpoint: '/api/word-to-pdf',
    payloadKey: 'files'
  },
  'pdf-to-word': {
    title: 'PDF to Word',
    subTitle: 'Convert PDF files to editable Word documents.',
    fileTypeLabel: 'PDF',
    outputExt: 'docx',
    accentColor: '#1F51FF',
    bgGradient: 'from-indigo-600 to-blue-500',
    themeClass: 'text-[#1F51FF] bg-blue-50 border-blue-100',
    acceptTypes: '.pdf,application/pdf',
    endpoint: '/api/pdf-to-word',
    payloadKey: 'images'
  },
  'excel-to-pdf': {
    title: 'Excel to PDF',
    subTitle: 'Convert Excel spreadsheets to PDF files with high quality.',
    fileTypeLabel: 'XLSX',
    outputExt: 'pdf',
    accentColor: '#10B981', // Emerald Green
    bgGradient: 'from-emerald-600 to-teal-500',
    themeClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    acceptTypes: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    endpoint: '/api/excel-to-pdf',
    payloadKey: 'images'
  },
  'pdf-to-excel': {
    title: 'PDF to Excel',
    subTitle: 'Convert PDF tables and data into editable Excel spreadsheets.',
    fileTypeLabel: 'PDF',
    outputExt: 'xlsx',
    accentColor: '#10B981',
    bgGradient: 'from-emerald-600 to-teal-500',
    themeClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    acceptTypes: '.pdf,application/pdf',
    endpoint: '/api/pdf-to-excel',
    payloadKey: 'images'
  },
  'powerpoint-to-pdf': {
    title: 'PowerPoint to PDF',
    subTitle: 'Convert PowerPoint presentations to high-quality PDF files.',
    fileTypeLabel: 'PPTX',
    outputExt: 'pdf',
    accentColor: '#F97316', // Burnt Orange
    bgGradient: 'from-orange-600 to-red-500',
    themeClass: 'text-orange-600 bg-orange-50 border-orange-100',
    acceptTypes: '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation',
    endpoint: '/api/powerpoint-to-pdf',
    payloadKey: 'images'
  }
};