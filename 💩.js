var GitHubApi = require('github')
const Promise = require('bluebird')

var github = new GitHubApi()
const authorsWeekActivity = {}
github.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_AUTH_TOKEN
})
const outAuthors = []
const repos = [
  [ 'CodeNow', 'CustomerBot' ],
  [ 'CodeNow', 'ProductScripts' ],
  [ 'CodeNow', 'agreeable-egret' ],
  [ 'runnable', 'api-client' ],
  [ 'CodeNow', 'api' ],
  [ 'CodeNow', 'arithmancy' ],
  [ 'CodeNow', 'astral' ],
  [ 'CodeNow', 'big-poppa' ],
  [ 'CodeNow', 'blog' ],
  [ 'CodeNow', 'charon' ],
  [ 'Runnable', 'cli' ],
  [ 'CodeNow', 'cream' ],
  [ 'CodeNow', 'detention' ],
  [ 'CodeNow', 'devops-scripts' ],
  [ 'codenow', 'dock-init' ],
  [ 'CodeNow', 'docker-listener' ],
  [ 'CodeNow', 'docks-cli' ],
  [ 'Runnable', 'docs' ],
  [ 'CodeNow', 'drake' ],
  [ 'Runnable', 'error-cat' ],
  [ 'CodeNow', 'eru' ],
  [ 'CodeNow', 'fluffy' ],
  [ 'CodeNow', 'furry-cactus' ],
  [ 'CodeNow', 'github-varnish' ],
  [ 'Runnable', 'heimdall' ],
  [ 'CodeNow', 'image-builder' ],
  [ 'CodeNow', 'kartographer' ],
  [ 'CodeNow', 'khronos' ],
  [ 'CodeNow', 'krain' ],
  [ 'Runnable', 'libra' ],
  [ 'CodeNow', 'link' ],
  [ 'Runnable', 'loki' ],
  [ 'Runnable', 'monitor-dog' ],
  [ 'CodeNow', 'navi-entry' ],
  [ 'CodeNow', 'navi' ],
  [ 'CodeNow', 'optimus' ],
  [ 'Runnable', 'orion' ],
  [ 'CodeNow', 'padme' ],
  [ 'CodeNow', 'palantiri' ],
  [ 'CodeNow', 'papyrus' ],
  [ 'CodeNow', 'pheidi' ],
  [ 'Runnable', 'ponos' ],
  [ 'CodeNow', 'runnable-angular' ],
  [ 'CodeNow', 'runnable-cms' ],
  [ 'CodeNow', 'runnable-hostname' ],
  [ 'CodeNow', 'runnable.com' ],
  [ 'CodeNow', 'sauron' ],
  [ 'CodeNow', 'slash-docker' ],
  [ 'CodeNow', 'snoop-a-loop' ],
  [ 'Runnable', 'swarmerode' ],
  [ 'CodeNow', 'zendesk' ]
]

const validUsers = {
  tosih: 'Sohail',
  prafulrana: 'Praful',
  anandkumarpatel: 'Anand',
  Nathan219: 'Nathan',
  sundippatel: 'Sundip',
  ykumar6: 'Yash',
  runnabro: 'Tony',
  henrymollman: 'Henry',
  thejsj: 'Jorge',
  Myztiq: 'Kahn',
  damienrunnable: 'Damien',
  podviaznikov: 'Anton',
  taylordolan: 'Taylor',
  kolofsen: 'Ken',
  rickiesherman: 'Rickie'
}

Promise.resolve(repos)
.each((repoInfo) => {
  return github.repos.getStatsContributors({
    owner: repoInfo[0],
    repo: repoInfo[1]
  })
  .then((res) => {
    res.data.forEach(addActivityToAuthor)
  })
  .catch((err) => {
    console.log('XXXXERR', repoInfo[0], repoInfo[1], err)
  })
})
.then(() => {
  // sumAllValues
  Object.keys(authorsWeekActivity).forEach((authorName) => {
    if (!validUsers[authorName]) { return }

    outAuthors.push({
      name: validUsers[authorName],
      data: authorsWeekActivity[authorName].reduce((out, item) => {
        return {
          a: item.a + out.a,
          c: item.c + out.c,
          d: item.d + out.d
        }
      }, {
        a: 0,
        c: 0,
        d: 0
      })
    })
  })

  // sendResultsToSlack
  // console.log('done', outAuthors)
})
.then(() => {
  const gainSort = outAuthors.sort((a, b) => {
    if (a.data.a < b.data.a) {
      return -1
    }
    if (a.data.a > b.data.a) {
      return 1
    }
    // a must be equal to b
    return 0
  })

  const loserSort = outAuthors.sort((a, b) => {
    if (a.data.d < b.data.d) {
      return -1
    }
    if (a.data.d > b.data.d) {
      return 1
    }
    // a must be equal to b
    return 0
  })
  console.log('gainSort:')
  gainSort.map((i) => {
    console.log(`@${i.name}: ${i.data.a}`)
  })

  console.log('loserSort:')
  loserSort.map((i) => {
    console.log(`@${i.name}: ${i.data.d}`)
  })
})
function addActivityToAuthor (activity) {
  const week = activity.weeks[activity.weeks.length - 2]

  if (authorsWeekActivity[activity.author.login]) {
    authorsWeekActivity[activity.author.login].push(week)
  } else {
    authorsWeekActivity[activity.author.login] = [ week ]
  }
}
