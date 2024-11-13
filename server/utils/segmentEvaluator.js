export const evaluateSegment = (customer, conditions) => {
  if (conditions.length === 0) return false;

  let result = true;
  let currentResult = true;

  for (let i = 0; i < conditions.length; i++) {
    const condition = conditions[i];
    const value = customer[condition.field];
    const conditionValue = Number(condition.value);

    let matches = false;
    switch (condition.operator) {
      case '>':
        matches = value > conditionValue;
        break;
      case '<=':
        matches = value <= conditionValue;
        break;
      case '=':
        matches = value === conditionValue;
        break;
      case '!=':
        matches = value !== conditionValue;
        break;
    }

    if (i === 0) {
      currentResult = matches;
    } else {
      if (condition.conjunction === 'AND') {
        currentResult = currentResult && matches;
      } else {
        result = result || currentResult;
        currentResult = matches;
      }
    }
  }

  return result && currentResult;
};