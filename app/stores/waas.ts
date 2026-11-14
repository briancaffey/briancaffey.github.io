import { waasTopSkills } from '~/data/charts/waas'

// Type definitions
interface JobDetails {
  salary?: { avg: number };
  equity?: { avg: number };
  min_years_experience: number;
}

interface Job {
  job_title: string;
  details: JobDetails;
}

interface Company {
  company_name: string;
  jobs: Job[];
}

interface SkillFrequency {
  [key: string]: string[];
}

interface DataRow {
  x: number;
  y: number;
  jobTitle: string;
  companyName: string;
}

interface JobDataSeries {
  name: number | string;
  data: DataRow[];
}

export const useWaasStore = defineStore('waas', () => {
  // State
  const companies = ref<Company[]>([]);
  const ideaIndex = ref<number>(0);
  const generatedIdeas = ref<string[]>(['loading gpt-2 generated ideas...']);
  const skillFrequencies = ref<SkillFrequency>({});
  const topSkills = ref<[string, number][]>([...waasTopSkills]);

  // Getters
  const getIdeaIndex = computed(() => ideaIndex.value % 10000);
  const getTopSkills = computed(() => topSkills.value.map(x => x[0]));
  const getTopSkillCounts = computed(() => topSkills.value.map(x => x[1]));
  const getSkillFrequencies = computed(() => skillFrequencies.value);
  const getGeneratedIdeas = computed(() => (idx: number) => generatedIdeas.value[idx]);
  const getRelatedSkillsForSkill = computed(() => (selectedSkill: string) => skillFrequencies.value[selectedSkill]);
  const getCompanies = computed(() => companies.value);
  const getSalaryEquitySeries = computed(() => {
    const jobData: JobDataSeries[] = [];
    for (const company of companies.value) {
      for (const job of company.jobs) {
        const companyName = company.company_name;
        const avgSalary = job.details.salary ? job.details.salary.avg : 0;
        const avgEquity = job.details.equity ? job.details.equity.avg : 0;
        const experience = job.details.min_years_experience;
        const jobTitle = job.job_title;
        const dataRow: DataRow = { x: avgSalary, y: avgEquity, jobTitle, companyName };

        const series = jobData.find((x) => x.name === experience);
        if (series) {
          series.data.push(dataRow);
        } else {
          jobData.push({ name: experience, data: [dataRow] });
        }
      }
    }
    return jobData.map((x) => ({
      ...x,
      name: Number.isInteger(x.name) ? `${x.name}+ Years` : 'Any',
    }));
  });

  // Actions
  async function fetchData(): Promise<void> {
    const response = await fetch('/static/waas_10.json');
    const data: Company[] = await response.json();
    SET_COMPANIES(data);
  }

  async function fetchSkillFrequencyData(): Promise<void> {
    const response = await fetch('/static/waas/skill_pairs.json');
    const data: SkillFrequency = await response.json();
    SET_SKILL_FREQUENCIES(data);
  }

  async function fetchGeneratedIdeas(): Promise<void> {
    const response = await fetch('/static/waas/generated_ideas.json');
    const data: string[] = await response.json();
    SET_GENERATED_IDEAS(data);
  }

  function changeIdeasIndex(payload: number): void {
    SET_IDEAS_INDEX(payload);
  }

  function SET_IDEAS_INDEX(payload: number): void {
    ideaIndex.value += payload;
  }

  function SET_GENERATED_IDEAS(payload: string[]): void {
    generatedIdeas.value = payload;
  }

  function SET_COMPANIES(payload: Company[]): void {
    companies.value = payload;
  }

  function SET_SKILL_FREQUENCIES(payload: SkillFrequency): void {
    skillFrequencies.value = payload;
  }

  return {
    // State
    companies,
    ideaIndex,
    generatedIdeas,
    skillFrequencies,
    topSkills,
    // Getters
    getIdeaIndex,
    getTopSkills,
    getTopSkillCounts,
    getSkillFrequencies,
    getGeneratedIdeas,
    getRelatedSkillsForSkill,
    getCompanies,
    getSalaryEquitySeries,
    // Actions
    fetchData,
    fetchSkillFrequencyData,
    fetchGeneratedIdeas,
    changeIdeasIndex,
    SET_IDEAS_INDEX,
    SET_GENERATED_IDEAS,
    SET_COMPANIES,
    SET_SKILL_FREQUENCIES,
  };
});
