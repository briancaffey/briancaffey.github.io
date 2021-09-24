/* eslint-disable no-console */
export const state = () => ({
  companies: [],
  ideaIndex: 0,
  generatedIdeas: ['loading gpt-2 generated ideas...'],
  skillFrequencies: [],
  topSkills: [
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
    ['PUPPET', 3],
    ['REDSHIFT', 3],
    ['SQL SERVER', 3],
    ['GROOVY', 3],
    ['VERILOG', 3],
    ['TORCH/PYTORCH', 3],
    ['CLOJURE', 3],
    ['MICROSOFT AZURE', 3],
    ['HBASE', 2],
    ['RDS/AURORA', 2],
    ['FIRMWARE', 2],
    ['ABAP', 2],
    ['ARDUINO', 2],
    ['MICROCONTROLLERS', 2],
    ['SOLIDITY', 2],
    ['UNREAL ENGINE', 2],
    ['COFFEESCRIPT', 2],
    ['LUA', 2],
    ['MACOS', 2],
    ['NEO4J', 2],
    ['INFORMATION SECURITY', 2],
    ['REINFORCEMENT LEARNING (RL)', 2],
    ['DEVICE DRIVERS', 2],
    ['EMBEDDED LINUX', 2],
    ['ELASTIC STACK (ELK)', 1],
    ['IIS', 1],
    ['ORACLE', 1],
    ['F#', 1],
    ['SQLITE', 1],
    ['HASKELL', 1],
    ['SCHEME', 1],
    ['MS SQL', 1],
    ['MARIADB', 1],
    ['MAVEN', 1],
    ['SEARCH', 1],
    ['OCAML', 1],
    ['JULIA', 1],
    ['GPU PROGRAMMING', 1],
    ['HACK', 1],
    ['XAMARIN', 1],
    ['CORDOVA', 1],
    ['SAS', 1],
    ['ASSEMBLY', 1],
    ['XML', 1],
    ['MEMCACHED', 1],
    ['LESS', 1],
    ['AMAZON ECHO', 1]
  ]
})

export const getters = {
  getIdeaIndex: (s) => {
    return s.ideaIndex % 10000
  },
  getTopSkills: s => s.topSkills.map(x => x[0]),
  getTopSkillCounts: s => s.topSkills.map(x => x[1]),
  getSkillFrequencies: s => s.skillFrequencies,
  getGeneratedIdeas: s => idx => s.generatedIdeas[idx],
  getRelatedSkillsForSkill: s => (selectedSkill) => {
    return s.skillFrequencies[selectedSkill]
  },
  getCompanies: s => s.companies,
  getSalaryEquitySeries: (s) => {
    // eslint-disable-next-line prefer-const
    let jobData = []
    // eslint-disable-next-line prefer-const
    for (let company of s.companies) {
      // eslint-disable-next-line prefer-const
      for (let job of company.jobs) {
        // eslint-disable-next-line prefer-const
        const companyName = company.company_name
        const avgSalary = job.details.salary ? job.details.salary.avg : 0
        const avgEquity = job.details.equity ? job.details.equity.avg : 0
        const experience = job.details.min_years_experience
        const jobTitle = job.job_title
        const dataRow = { x: avgSalary, y: avgEquity, jobTitle, companyName }

        // add the experience to a series in `data`
        if (
          jobData.find((x) => {
            return x.name === experience
          })
        ) {
          jobData
            .find((x) => {
              return x.name === experience
            })
            .data.push(dataRow)
          // if the series name is not in data yet, add it
        } else {
          jobData.push({
            name: experience,
            data: [dataRow]
          })
        }
      }
    }
    return jobData.map((x) => {
      // eslint-disable-next-line dot-notation
      const name = Number.isInteger(x['name']) ? `${x['name']}+ Years` : 'Any'
      return { ...x, name }
    })
  }
}

export const actions = {
  async fetchData ({ commit }) {
    const response = await this.$axios.$get('static/waas_10.json')
    commit('SET_COMPANIES', response)
  },
  async fetchSkillFrequencyData ({ commit }) {
    const response = await this.$axios.$get('static/waas/skill_pairs.json')
    commit('SET_SKILL_FREQUENCIES', response)
  },
  async fetchGeneratedIdeas ({ commit }) {
    const response = await this.$axios.$get('static/waas/generated_ideas.json')
    commit('SET_GENERATED_IDEAS', response)
  },
  changeIdeasIndex ({ commit }, payload) {
    commit('SET_IDEAS_INDEX', payload)
  }
}

export const mutations = {
  SET_IDEAS_INDEX: (state, payload) => {
    state.ideaIndex = state.ideaIndex + payload
  },
  SET_GENERATED_IDEAS: (state, payload) => {
    state.generatedIdeas = payload
  },
  SET_COMPANIES: (state, payload) => {
    state.companies = payload
  },
  SET_SKILL_FREQUENCIES: (state, payload) => {
    state.skillFrequencies = payload
  }
}
