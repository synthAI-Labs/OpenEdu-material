import fs from 'fs';
import path from 'path';

interface Module {
  numbering: number;
  name: string;
  type: string;
  madeByUser: string[];
  madeByUserGit: string[];
  description: string;
  content: string;
  image: string;
}


interface Course {
  name: string;
  modules: Module[];
}

// Function to create a demo course structure
// Function to create a demo course structure
function createDemoCourse(courseName: string, moduleNames: string[]): Course {
  const modules: Module[] = moduleNames.map((moduleName, index) => ({
    numbering: index + 1,
    name: `Module ${index + 1}`,
    type: 'text',
    madeByUser: ['https://avatars.githubusercontent.com/u/117301124?v=4'],
    madeByUserGit: ['https://github.com/Himasnhu-AT/'],
    description: `Description for ${moduleName}`,
    content: `https://raw.githubusercontent.com/synthAI-Labs/OpenEdu-material/main/JavaScript/${moduleName}/${moduleName.toLowerCase()}.mdx`,
    image: `image${index + 1}.jpg`,
  }));

  return {
    name: courseName,
    modules
  };
}


// Function to save the demo course metadata to a JSON file
function saveDemoCourse(course: Course) {
  const courseDirectory = path.join(__dirname, `/${course.name}`);

  // Save course metadata to a JSON file
  const courseFilePath = path.join(courseDirectory, '/course.json');
  fs.writeFileSync(courseFilePath, JSON.stringify(course, null, 2));

  console.log(`Demo course ${course.name} created successfully!`);
}

// Function to get course and module names from the directory structure
function getCourseAndModuleNames(directoryPath: string): { courseName: string; moduleNames: string[] }[] {
  const courseDirectories = fs.readdirSync(directoryPath, { withFileTypes: true });

  return courseDirectories
    .filter((dirent) => dirent.isDirectory() && dirent.name !== '.git' && dirent.name !== 'node_modules')
    .map((courseDirent) => {
      const courseName = courseDirent.name;
      const moduleDirectoryPath = path.join(directoryPath, `/${courseName}`);
      const moduleNames = fs.readdirSync(moduleDirectoryPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((moduleDirent) => moduleDirent.name);

      return { courseName, moduleNames };
    });
}

// Example usage - Run the script once
const baseDirectory = path.join(__dirname, '/');

// Get course and module names from the directory structure
const courses = getCourseAndModuleNames(baseDirectory);

// Create and save demo courses
courses.forEach((course) => {
  const demoCourse = createDemoCourse(course.courseName, course.moduleNames);
  saveDemoCourse(demoCourse);
});
