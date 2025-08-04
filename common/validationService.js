exports.validatePlayerInput = ({ name, score, id }) => {
    const errors = [];
  
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        errors.push('Name is required.');
      } else if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
        errors.push('Name can contain only letters, numbers, and spaces.');
      }
    }
  
    if (score !== undefined) {
      if (typeof score !== 'number' || score < 0) {
        errors.push('Score must be a positive number.');
      }
    }
  
    if (id !== undefined) {
      if (typeof id !== 'number' || id <= 0) {
        errors.push('Id must be a positive number.');
      }
    }
  
    return errors;
  };
  