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
  const topSkills = ref<[string, number][]>([
    ['JAVASCRIPT', 330],
    ['REACT', 323],
    ['PYTHON', 312],
    ['AMAZON WEB SERVICES (AWS)', 200],
    ['NODE.JS', 195],
    ['POSTGRESQL', 132],
    ['TYPESCRIPT', 114],
    ['JAVA', 79],
    ['SQL', 74],
    ['RUBY ON RAILS', 72],
    ['CSS', 71],
    ['HTML', 71],
    ['DOCKER', 66],
    ['KUBERNETES', 58],
    ['GO', 58],
    ['REACT NATIVE', 58],
    ['C++', 55],
    ['GRAPHQL', 48],
    ['GOOGLE CLOUD', 46],
    ['RUBY', 44],
    ['DJANGO', 44],
    ['MACHINE LEARNING', 44],
    ['MONGODB', 43],
    ['IOS', 38],
    ['MYSQL', 36],
    ['ANDROID', 35],
    ['DATA ANALYTICS', 32],
    ['GIT', 30],
    ['ANGULAR', 29],
    ['SWIFT', 29],
    ['LINUX', 28],
    ['SOFTWARE ARCHITECTURE', 24],
    ['KOTLIN', 23],
    ['TENSORFLOW', 22],
    ['DISTRIBUTED SYSTEMS', 22],
    ['PHP', 22],
    ['DATA WAREHOUSING', 22],
    ['DEEP LEARNING', 20],
    ['DATA MODELING', 20],
    ['C#', 19],
    ['FLASK', 19],
    ['C', 19],
    ['REDIS', 18],
    ['MICROSERVICES', 18],
    ['COMPUTER VISION', 17],
    ['EXPRESS', 15],
    ['BASH/SHELL', 13],
    ['OBJECTIVE-C', 13],
    ['FIREBASE', 12],
    ['SCALA', 11],
    ['SOFTWARE SECURITY', 11],
    ['UNITY', 11],
    ['R', 11],
    ['KAFKA', 10],
    ['SPARK', 10],
    ['ELASTICSEARCH', 10],
    ['ETL', 10],
    ['NATURAL LANGUAGE PROCESSING', 10],
    ['HEROKU', 10],
    ['NGINX', 9],
    ['JENKINS', 9],
    ['RUST', 9],
    ['IMAGE PROCESSING', 8],
    ['SERVERLESS', 8],
    ['BLOCKCHAIN', 8],
    ['OPENCV', 8],
    ['CAD DESIGN', 7],
    ['JQUERY', 7],
    ['HADOOP', 6],
    ['.NET CORE', 6],
    ['TCP/IP', 6],
    ['ELIXIR', 6],
    ['INTERNET OF THINGS (IOT)', 5],
    ['SASS', 5],
    ['OPENGL', 5],
    ['DYNAMODB', 5],
    ['GOOGLE APP ENGINE', 5],
    ['UNIX', 4],
    ['SPRING FRAMEWORK', 4],
    ['CUDA', 4],
    ['DART', 4],
    ['ERLANG', 4],
    ['RABBITMQ', 4],
    ['KERAS', 4],
    ['SCSS', 4],
    ['ML', 4],
    ['MATLAB', 4],
    ['SPRING', 4],
    ['CASSANDRA', 4],
    ['HIVE', 3],
  ]);

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
