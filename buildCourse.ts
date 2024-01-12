import fs from 'fs';
import path from 'path';

interface Module {
  numbering: number;
  name: string;
  mdxFileName: string;
}

interface Course {
  name: string;
  modules: Module[];
}

// Function to create a demo course structure
function createDemoCourse(courseName: string, moduleNames: string[]): Course {
  const modules: Module[] = moduleNames.map((moduleName, index) => ({
    numbering: index + 1,
    name: moduleName,
    mdxFileName: `${moduleName}.mdx`
  }));

  return {
    name: courseName,
    modules
  };
}

// Function to create module MDX content
function createModuleMDXContent(moduleName: string): string {
  return `# ${moduleName}\n\nThis is the content of the ${moduleName} module.`;
}

// Function to save the demo course to a directory
function saveDemoCourse(course: Course) {
  const courseDirectory = path.join(__dirname, `/${course.name}`);

  // Create the course directory if it doesn't exist
  if (!fs.existsSync(courseDirectory)) {
    fs.mkdirSync(courseDirectory);
  }

  // Save modules to the course directory
  course.modules.forEach((module) => {
    const moduleDirectory = path.join(courseDirectory, `/${module.name.replace(/\s+/g, '_').toLowerCase()}`);
    const mdxFilePath = path.join(moduleDirectory, `/${module.mdxFileName}`);

    // Create the module directory if it doesn't exist
    if (!fs.existsSync(moduleDirectory)) {
      fs.mkdirSync(moduleDirectory);
    }

    // Write the demo MDX content to the file
    fs.writeFileSync(mdxFilePath, createModuleMDXContent(module.name));
  });

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
