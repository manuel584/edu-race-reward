
// Add the missing helpfulness, respect, teamwork, and excellence fields to the form submission
// in the handleFormSubmit function

const handleFormSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Create student object from form data
  const studentData = {
    subjects: selectedSubjects,
    name,
    points: parseInt(points),
    attendance: parseInt(attendance),
    booksOwned: parseInt(booksOwned),
    engagementScore: parseInt(engagementScore),
    nationality,
    grade,
    helpfulness: 0,
    respect: 0,
    teamwork: 0,
    excellence: 0
  };
  
  if (student) {
    updateStudent(student.id, studentData);
    toast.success(t.studentUpdated || "Student updated successfully");
  } else {
    addStudent(studentData);
    toast.success(t.studentAdded || "Student added successfully");
  }
  
  onClose();
};
