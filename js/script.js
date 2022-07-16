// select the div with a class of “overview”
const overview = document.querySelector(".overview");
const username = "E-C-Shackelford";
// select the unordered list to display the repos list
const reposList = document.querySelector(".repo-list");
// select section with “repos” class where all repo info appears
const reposSection = document.querySelector(".repos");
// select section with “repo-data” class where individual repo data appears
const repoDataSection = document.querySelector(".repo-data");
// select Back to Repo Gallery button
const backButton = document.querySelector(".view-repos");
// select input with “Search by name” placeholder
const filterInput = document.querySelector(".filter-repos");

// ***** FETCH API JSON DATA *****

// fetch info from GitHub profile using the GitHub API address, target the "users" endpoint, and add the global username variable to the endpoint
const githubUserInfo = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  // console.log(data);
  displayUserInfo(data);
};

githubUserInfo();

// fetch and display user info
const displayUserInfo = function (data) {
  // create a new div and assign it a class of “user-info”
  const div = document.createElement("div");
  div.classList.add("user-info");
  // populate the div with the elements for figure, image, and paragraphs
  // inside the placeholders, use the JSON data to grab the relevant properties to display on the page
  div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
    `;
  overview.append(div);
  githubRepos();
};

// ***** FETCH REPOS *****

const githubRepos = async function () {
  // find parameters to sort repos by the most recently updated to last updated as well as show up to 100 repos per page at a time
  const fetchRepos = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );
  // return the JSON response data for the repos
  const repoResponse = await fetchRepos.json();
  // console.log(repoResponse);
  displayRepos(repoResponse);
};
// githubRepos();  // confirmed it's fetching repositories, so commented out the call to the function — this step is needed to look through the properties

// display info regarding each repos
// ensure the function accepts the data returned from the last API call by passing the function repos as a parameter
const displayRepos = function (repos) {
  // display the input element
  filterInput.classList.remove("hide");
  // loop and create a list item for each repo
  for (const repo of repos) {
    const li = document.createElement("li");
    // add the "repo" class to each item
    li.classList.add("repo");
    // add an <h3> element with the repo name to each item
    li.innerHTML = `<h3>${repo.name}</h3>`;
    // append the list item to the global variable selecting the unordered repos list
    reposList.append(li);
  }
};

// ***** DISPLAY REPO INFO *****

reposList.addEventListener("click", function (e) {
  // check if the event target (the element on which one clicks) matches the <h3> element (repo name)
  if (e.target.matches("h3")) {
    // target the innerText where the event happens
    const repoName = e.target.innerText;
    // console.log(repoName);
    specificRepoInfo(repoName); // after creating the specificRepoInfo function, call it here and pass it repoName as an argument, then click on the title of a few repos and look at the objects in the console (take note of the language_url property)
  }
});

const specificRepoInfo = async function (repoName) {
  const fetchRepoInfo = await fetch(
    // make a fetch request to grab info about the specific repo
    `https://api.github.com/repos/${username}/${repoName}`
  );
  const repoInfo = await fetchRepoInfo.json();
  console.log(repoInfo);

  // fetch data from language_url property of repoInfo and then save the JSON response
  const fetchLanguages = await fetch(repoInfo.languages_url);
  const languageData = await fetchLanguages.json();
  // console.log(languageData);

  // create a list of languages — loop through the array and add the languages to the end of the array
  const languages = [];
  for (const language in languageData) {
    languages.push(language);
    // console.log(languages); // click on some repos and the array will display in the console
  }
  displaySpecificInfo(repoInfo, languages); // after calling displaySpecificInfo function here and passing it these two arguments, the name, description, default branch, and a button that links to the repo on GitHub when clicked will all display on the page
};

// display the specific repo info
const displaySpecificInfo = function (repoInfo, languages) {
  repoDataSection.innerHTML = "";
  const div = document.createElement("div");
  // add the selected repo’s name, description, default branch, and link to its code on GitHub
  // inside the five placeholders, use the JSON data to grab the relevant properties to display on the page (use the properties from the object retrieved when the specific repos were fetched)
  div.innerHTML = `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${
      repoInfo.html_url
    }" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;
  repoDataSection.append(div);
  repoDataSection.classList.remove("hide");
  reposSection.classList.add("hide");
  backButton.classList.remove("hide"); // a user will see the "Back to Repo Gallery" button when clicking on a repo, allowing a user to click on the back button and return to the complete list of repos (the specific repo info and back button will then disappear)
};

// ***** CREATE A DYNAMIC SEARCH *****

backButton.addEventListener("click", function () {
  reposSection.classList.remove("hide");
  repoDataSection.classList.add("hide");
  backButton.classList.add("hide");
});

// dynamic search
filterInput.addEventListener("input", function (e) {
  // capture the value of the search text
  const searchText = e.target.value;
  // console.log(searchText);

  // select all the elements on the page with a “repo” class
  const repos = document.querySelectorAll(".repo");
  // assign a variable to the lowercase value of the search text
  const lowercaseSearchText = searchText.toLowerCase();

  for (const repo of repos) {
    // assign a variable to the lowercase value of the innerText of each repo
    const lowercaseRepoText = repo.innerText.toLowerCase();
    // does the lowercase repo text include the lowercase search text?
    if (lowercaseRepoText.includes(lowercaseSearchText)) {
      // if the repo contains the text, show the repo, and if it doesn’t contain the text, hide the repo
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});
