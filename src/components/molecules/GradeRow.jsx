import React from "react";
import Badge from "@/components/atoms/Badge";

const GradeRow = ({ assignment, course, score, maxScore, weight, className }) => {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  
  const getGradeBadge = (percent) => {
    if (percent >= 90) return { variant: "success", text: "A" };
    if (percent >= 80) return { variant: "primary", text: "B" };
    if (percent >= 70) return { variant: "warning", text: "C" };
    if (percent >= 60) return { variant: "accent", text: "D" };
    return { variant: "error", text: "F" };
  };
  
  const gradeBadge = getGradeBadge(percentage);
  
  return (
    <tr className={`hover:bg-gray-50 transition-colors duration-200 ${className}`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {assignment}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {course}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {score}/{maxScore}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={gradeBadge.variant}>
          {gradeBadge.text} ({percentage.toFixed(1)}%)
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {(weight * 100).toFixed(0)}%
      </td>
    </tr>
  );
};

export default GradeRow;