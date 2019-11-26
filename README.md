# DependenISEE
Give your GitHub repository link and receive your analysis

**Goal** 
Understanding what a given project depends on (also known as dependencies)

**Setup**
```
npm install -g bundle-phobia-cli
npm install in root directory & lib folder
npm start in root directory to run front-end
yarn start in lib folder to run back-end
```

Navigate through the code to find ```const octokit = new Octokit();``` Please replace it with the ```const octokit = new Octokit({ auth: YOUR_TOKEN_HERE });```. You can generate the token here `https://github.com/settings/tokens/new`

**Limitations**
The project currently only works for js projects with a yarn.lock file and package.json in their root folder. We are working to add improvements.

**Task Assignment**
Analyzing dependencies and their usage, as well as dependency's dependencies (Ryan)
Visualizing dependencies and their usage (Sam)
Visualizing dependencies of dependencies and their usage (Aya) 
Analyzing best path for upgrading libraries, repos which have been abandoned (Andy)
Visualizing best path for upgrading libraries, abandoned repos (Megha)
Front end UI layout with React.js (Aya)

**Functionality**
The idea behind the project is to get a better idea of what resides in the node_modules folder. Dependencies make up a huge part of js projects. The dependencies we add to our project, depend on other dependencies, and they depend on other dependencies (you get the idea). For the most part, we only care about the dependencies that we added and the dependencies of those dependencies (aka sub-dependencies). 

We intended to visualize the upgrade information of a specific package but could not quite find a way to extract the data we needed.

**Just for Fun**
We tried another type of visualization of the dependencies where we use ThreeJS to render the dependencies. The idea behind this visualization is that each sphere will represent a dependency present in your package.json but after extracting information using your yarn.lock file. Using this information allows us to find duplicates (each color represents a unique dependency) in the yarn.lock file. Another thing about this visualization is that the size of the sphere directly corresponds to the number of dependencies of that dependency in your yarn.lock folder.

To view this visualization, navigate to the index.js file and change show3D to true
