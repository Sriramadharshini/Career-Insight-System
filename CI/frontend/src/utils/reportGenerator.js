import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Helper to format date
const formatDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const generateAnalyticsPDF = (data, period) => {
  if (!data) return;
  const doc = new jsPDF();
  const title = `Platform Analytics Report - ${period.toUpperCase()}`;
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text(title, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on: ${formatDate()}`, 14, 30);
  
  // High-level stats
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Overview Metrics', 14, 45);
  
  const overviewData = [
    ['Total Engagements', data.engagement?.total?.toString() || '0'],
    ['Average Satisfaction', data.engagement?.average?.toString() || '0'],
    ['Elite Ratings (5 Stars)', data.engagement?.elite?.toString() || '0'],
    ['AI Operations', data.aiUsage?.toString() || '0']
  ];
  
  doc.autoTable({
    startY: 50,
    head: [['Metric', 'Value']],
    body: overviewData,
    theme: 'grid',
    headStyles: { fillColor: [56, 189, 248], textColor: 255 }, // light blue
    styles: { fontSize: 10, cellPadding: 4 },
  });

  // Feature Usage
  let finalY = doc.lastAutoTable.finalY || 50;
  
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Feature Engagement', 14, finalY + 15);
  
  const featureData = data.featureUsage?.map(f => [f.name, f.value.toString()]) || [];
  
  doc.autoTable({
    startY: finalY + 20,
    head: [['Feature', 'Usage Count']],
    body: featureData,
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246], textColor: 255 }, // purple
    styles: { fontSize: 10, cellPadding: 4 },
  });
  
  finalY = doc.lastAutoTable.finalY || finalY + 20;

  // Market Opportunities (Jobs)
  if (data.jobs && data.jobs.labels && data.jobs.labels.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Market Opportunities (Job Types)', 14, finalY + 15);
    
    const jobsData = data.jobs.labels.map((l, i) => [l, data.jobs.data[i].toString()]);
    
    doc.autoTable({
      startY: finalY + 20,
      head: [['Job Type', 'Frequency']],
      body: jobsData,
      theme: 'grid',
      headStyles: { fillColor: [245, 158, 11], textColor: 255 }, // amber
      styles: { fontSize: 10, cellPadding: 4 },
    });
  }
  
  finalY = doc.lastAutoTable.finalY || finalY + 20;

  // Career Trends - Top Technologies
  if (data.careerTrends?.topTechnologies?.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Trending Technologies (Market Demand)', 14, finalY + 15);
    
    const techData = data.careerTrends.topTechnologies.map(t => [
      t.name, 
      t.count.toString(), 
      `${t.growth > 0 ? '+' : ''}${t.growth}%`, 
      t.demandLevel
    ]);
    
    doc.autoTable({
      startY: finalY + 20,
      head: [['Technology', 'Users', 'Growth', 'Demand']],
      body: techData,
      theme: 'grid',
      headStyles: { fillColor: [74, 222, 128], textColor: 0 }, // green-400
      styles: { fontSize: 9, cellPadding: 3 },
    });
    
    finalY = doc.lastAutoTable.finalY || finalY + 20;
  }

  // Career Trends - Domains
  if (data.careerTrends?.careerDomains?.length > 0) {
    if (finalY > 240) { doc.addPage(); finalY = 20; }
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Primary Career Domains', 14, finalY + 15);
    
    const domainData = data.careerTrends.careerDomains.map(d => [d.name, d.count.toString(), `${d.growth > 0 ? '+' : ''}${d.growth}%`]);
    
    doc.autoTable({
      startY: finalY + 20,
      head: [['Domain Path', 'Interactions', 'Period Growth']],
      body: domainData,
      theme: 'striped',
      headStyles: { fillColor: [56, 189, 248], textColor: 255 }, // blue-400
      styles: { fontSize: 9, cellPadding: 3 },
    });
  }

  doc.save(`analytics_report_${period}_${new Date().getTime()}.pdf`);
};

export const generateAnalyticsCSV = (data, period) => {
  if (!data) return;
  
  const rows = [];
  rows.push(['Platform Analytics Report', period.toUpperCase()]);
  rows.push(['Generated On', formatDate()]);
  rows.push([]);
  
  rows.push(['OVERVIEW METRICS']);
  rows.push(['Metric', 'Value']);
  rows.push(['Total Engagements', data.engagement?.total || 0]);
  rows.push(['Average Satisfaction', data.engagement?.average || 0]);
  rows.push(['Elite Ratings', data.engagement?.elite || 0]);
  rows.push(['AI Operations', data.aiUsage || 0]);
  rows.push([]);
  
  rows.push(['FEATURE USAGE']);
  rows.push(['Feature', 'Count']);
  if (data.featureUsage) {
    data.featureUsage.forEach(f => rows.push([f.name, f.value]));
  }
  rows.push([]);
  
  rows.push(['CAREERS BY INDUSTRY']);
  rows.push(['Industry', 'Count']);
  if (data.careers && data.careers.labels) {
    data.careers.labels.forEach((l, i) => rows.push([l, data.careers.data[i]]));
  }
  
  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `analytics_data_${period}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateAIPDF = (aiData, period) => {
  if (!aiData) return;
  
  const doc = new jsPDF();
  const title = `AI Intelligence Summary - ${period.toUpperCase()}`;
  
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text(title, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${formatDate()}`, 14, 30);
  
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Global AI Utilization', 14, 45);
  
  const aiOverview = [
    ['Total AI Queries', aiData.aiUsage?.toString() || '0'],
    ['Active Period', period.toUpperCase()]
  ];
  
  doc.autoTable({
    startY: 50,
    head: [['Metric', 'Value']],
    body: aiOverview,
    theme: 'grid',
    headStyles: { fillColor: [34, 211, 238], textColor: 255 }, // cyan
    styles: { fontSize: 10, cellPadding: 4 },
  });
  
  let finalY = doc.lastAutoTable.finalY || 50;
  
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('AI Query Distribution by Feature', 14, finalY + 15);
  
  const featureData = aiData.featureUsage?.map(f => [f.name, f.value.toString()]) || [];
  
  doc.autoTable({
    startY: finalY + 20,
    head: [['Feature Target', 'Operations']],
    body: featureData,
    theme: 'striped',
    headStyles: { fillColor: [139, 92, 246], textColor: 255 }, // purple
    styles: { fontSize: 10, cellPadding: 4 },
  });
  
  finalY = doc.lastAutoTable.finalY || finalY + 20;
  
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('User Growth vs AI Adoption', 14, finalY + 15);
  
  const growthData = aiData.growth?.labels?.map((l, i) => [l, aiData.growth.data[i].toString()]) || [];
  
  doc.autoTable({
    startY: finalY + 20,
    head: [['Timeline', 'New Registrations']],
    body: growthData,
    theme: 'grid',
    headStyles: { fillColor: [56, 189, 248], textColor: 255 }, // blue
    styles: { fontSize: 10, cellPadding: 4 },
  });

  // Additional Intelligence: Career Predictions
  if (aiData.topCareerPaths?.length > 0) {
    if (finalY > 220) { doc.addPage(); finalY = 20; }
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('AI Career Predictions', 14, finalY + 15);
    
    const careerData = aiData.topCareerPaths.map(c => [c.name, c.count.toString()]);
    doc.autoTable({
      startY: finalY + 20,
      head: [['Career Path', 'User Match Count']],
      body: careerData,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 4 },
    });
    finalY = doc.lastAutoTable.finalY || finalY + 20;
  }

  // Additional Intelligence: Trending Skills
  if (aiData.topSkills?.length > 0) {
    if (finalY > 220) { doc.addPage(); finalY = 20; }
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Trending Skills Intelligence', 14, finalY + 15);
    
    const skillData = aiData.topSkills.map(s => [s.name, s.count.toString()]);
    doc.autoTable({
      startY: finalY + 20,
      head: [['Skill Identifier', 'Global Demand']],
      body: skillData,
      theme: 'striped',
      headStyles: { fillColor: [56, 189, 248], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 4 },
    });
  }

  doc.save(`ai_intelligence_report_${period}.pdf`);
};
