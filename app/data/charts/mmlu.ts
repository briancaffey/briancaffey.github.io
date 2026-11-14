// Chart data for the article components in app/components/content/mmlu/.
// Moved out of the components (#32) so the numbers live in one typed place and
// the components only describe how to draw them.

export interface ChartPoint { x: string | number; y: number }
export interface ChartSeries { name: string; data: (number | ChartPoint)[] }

// MmluBiasChart.vue
export const mmluBias: { series: ChartSeries[]; categories: (string | number)[] } = {
  series: [
    {"name":"gold (correct answer)","data":[22.9,24.7,25.5,26.9]},
    {"name":"model picks","data":[24.8,26.8,24.9,23.5]}
  ],
  categories: ["A","B","C","D"]
}

// MmluCategoryChart.vue
export const mmluCategory: { series: ChartSeries[]; categories: (string | number)[] } = {
  series: [
    {"name":"Accuracy","data":[70.2,67.7,82.1,77.1]}
  ],
  categories: ["STEM (n=3153)","Humanities (n=4705)","Social Sciences (n=3077)","Other (n=3107)"]
}

// MmluConfidenceChart.vue
export const mmluConfidence: { series: ChartSeries[]; categories: (string | number)[] } = {
  series: [
    {"name":"correct","data":[310,321,271,324,253,311,377,288,326,229,342,273,376,366,260,432,258,454,306,461,483,348,450,303,427,416,213,327,206,213,130,267]},
    {"name":"incorrect","data":[521,432,353,362,278,261,254,169,194,140,138,92,114,84,52,65,40,43,30,25,19,10,10,13,4,7,4,2,1,1,0,3]}
  ],
  categories: [0.16,0.48,0.81,1.13,1.45,1.77,2.09,2.42,2.74,3.06,3.38,3.71,4.03,4.35,4.67,5,5.32,5.64,5.96,6.28,6.61,6.93,7.25,7.57,7.9,8.22,8.54,8.86,9.18,9.51,9.83,10.15]
}

// MmluConfusionChart.vue
export const mmluConfusion: { series: ChartSeries[] } = {
  series: [
    {"name":"gold D","data":[{"x":"pred A","y":8.8},{"x":"pred B","y":11.2},{"x":"pred C","y":9},{"x":"pred D","y":70.9}]},
    {"name":"gold C","data":[{"x":"pred A","y":10.4},{"x":"pred B","y":11},{"x":"pred C","y":72.7},{"x":"pred D","y":5.9}]},
    {"name":"gold B","data":[{"x":"pred A","y":10.1},{"x":"pred B","y":75.6},{"x":"pred C","y":7.9},{"x":"pred D","y":6.4}]},
    {"name":"gold A","data":[{"x":"pred A","y":75.1},{"x":"pred B","y":10.4},{"x":"pred C","y":8.6},{"x":"pred D","y":6}]}
  ]
}

// MmluLengthAccuracy.vue
export const mmluLengthAccuracy: { series: ChartSeries[]; categories: (string | number)[] } = {
  series: [
    {"name":"accuracy","data":[82.1,78.8,79.7,82.3,70.8,66.2,65.5,62]}
  ],
  categories: [273,342,410,474,535,609,924,1496]
}

// MmluLengthHist.vue
export const mmluLengthHist: { series: ChartSeries[]; categories: (string | number)[] } = {
  series: [
    {"name":"questions","data":[1743,1807,1856,1721,1979,1470,291,275,170,57,97,146,151,85,80,62,60,90,199,526,435,208,97,40,20,10,31,67,68,29,6,1,3,21,42,32,22,26,14,5]}
  ],
  categories: [274,346,418,489,561,633,705,777,849,920,992,1064,1136,1208,1279,1351,1423,1495,1567,1639,1710,1782,1854,1926,1998,2070,2141,2213,2285,2357,2429,2500,2572,2644,2716,2788,2860,2931,3003,3075]
}

// MmluSubjectChart.vue
export const mmluSubject: { series: ChartSeries[]; colors: string[] } = {
  series: [
    {"name":"Accuracy","data":[{"x":"global facts","y":43},{"x":"abstract algebra","y":49},{"x":"high school mathematics","y":49.3},{"x":"formal logic","y":53.2},{"x":"professional accounting","y":53.9},{"x":"college physics","y":53.9},{"x":"virology","y":54.2},{"x":"college chemistry","y":55},{"x":"professional law","y":55.9},{"x":"moral scenarios","y":55.9},{"x":"college mathematics","y":57},{"x":"machine learning","y":59.8},{"x":"elementary mathematics","y":62.4},{"x":"econometrics","y":63.2},{"x":"high school physics","y":64.9},{"x":"anatomy","y":69.6},{"x":"college computer science","y":70},{"x":"human aging","y":71.7},{"x":"public relations","y":72.7},{"x":"high school chemistry","y":73.4},{"x":"high school statistics","y":74.1},{"x":"philosophy","y":74.3},{"x":"security studies","y":75.1},{"x":"electrical engineering","y":75.2},{"x":"college medicine","y":75.7},{"x":"professional psychology","y":76.1},{"x":"computer security","y":77},{"x":"business ethics","y":78},{"x":"high school macroeconomics","y":78.2},{"x":"clinical knowledge","y":78.5},{"x":"professional medicine","y":78.7},{"x":"conceptual physics","y":79.6},{"x":"moral disputes","y":79.8},{"x":"world religions","y":80.7},{"x":"nutrition","y":81},{"x":"jurisprudence","y":81.5},{"x":"sociology","y":82.1},{"x":"high school european history","y":82.4},{"x":"prehistory","y":83.6},{"x":"logical fallacies","y":84},{"x":"human sexuality","y":84},{"x":"international law","y":84.3},{"x":"astronomy","y":84.9},{"x":"high school computer science","y":85},{"x":"high school world history","y":86.5},{"x":"college biology","y":86.8},{"x":"high school us history","y":87.3},{"x":"management","y":87.4},{"x":"miscellaneous","y":87.6},{"x":"medical genetics","y":88},{"x":"us foreign policy","y":88},{"x":"high school microeconomics","y":88.2},{"x":"high school geography","y":88.9},{"x":"marketing","y":89.3},{"x":"high school biology","y":89.4},{"x":"high school psychology","y":89.9},{"x":"high school government and politics","y":93.3}]}
  ],
  colors: ["#C44E52","#4C72B0","#4C72B0","#DD8452","#C44E52","#4C72B0","#C44E52","#4C72B0","#DD8452","#DD8452","#4C72B0","#4C72B0","#4C72B0","#55A868","#4C72B0","#4C72B0","#4C72B0","#C44E52","#55A868","#4C72B0","#4C72B0","#DD8452","#55A868","#4C72B0","#C44E52","#55A868","#4C72B0","#C44E52","#55A868","#C44E52","#C44E52","#4C72B0","#DD8452","#DD8452","#C44E52","#DD8452","#55A868","#DD8452","#DD8452","#DD8452","#55A868","#DD8452","#4C72B0","#4C72B0","#DD8452","#4C72B0","#DD8452","#C44E52","#C44E52","#C44E52","#55A868","#55A868","#55A868","#C44E52","#4C72B0","#55A868","#55A868"]
}
