/* eslint-disable no-console */
export const state = () => ({
  companies: [],
})

export const getters = {
  getCompanies: (s) => s.companies,
  getSalaryEquitySeries: (s) => {
    // eslint-disable-next-line prefer-const
    let jobData = []
    // eslint-disable-next-line prefer-const
    for (let company of s.companies) {
      // eslint-disable-next-line prefer-const
      for (let job of company.jobs) {
        // eslint-disable-next-line prefer-const
        const avgSalary = job.details.salary ? job.details.salary.avg : 0
        const avgEquity = job.details.equity ? job.details.equity.avg : 0
        const experience = job.details.min_years_experience
        const dataRow = [avgSalary, avgEquity]

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
            data: [dataRow],
          })
        }
      }
    }
    return jobData.map((x) => {
      // eslint-disable-next-line dot-notation
      return { ...x, name: `${x['name']}+ Years` }
    })
  },
}

export const actions = {
  async fetchData({ commit }) {
    const response = await this.$axios.$get('static/waas_10.json')
    commit('SET_COMPANIES', response)
  },
}

export const mutations = {
  SET_COMPANIES: (state, payload) => {
    state.companies = payload
  },
}
