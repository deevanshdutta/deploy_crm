import React from 'react';

import { PlusCircle, X, ChevronDown } from 'lucide-react';
import { SegmentCondition } from '../types';

interface SegmentBuilderProps {
  conditions: SegmentCondition[];
  onChange: (conditions: SegmentCondition[]) => void;
}

export const FIELDS = [
  { value: 'totalSpending', label: 'Total Spending' },
  { value: 'visitCount', label: 'Visit Count' },
  { value: 'lastVisit', label: 'Last Visit' },
];

export const OPERATORS = [
  { value: '>', label: 'Greater than' },
  { value: '<=', label: 'Less than or equal' },
  { value: '=', label: 'Equal to' },
  { value: '!=', label: 'Not equal to' },
];

export default function SegmentBuilder({ conditions, onChange }: SegmentBuilderProps) {
  const addCondition = () => {
    onChange([
      ...conditions,
      {
        field: 'totalSpending',
        operator: '>',
        value: '',
        conjunction: conditions.length > 0 ? 'AND' : undefined,
      },
    ]);
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    onChange(newConditions);
  };

  const updateCondition = (index: number, updates: Partial<SegmentCondition>) => {
    const newConditions = conditions.map((condition, i) =>
      i === index ? { ...condition, ...updates } : condition
    );
    onChange(newConditions);
  };

  return (
    <div className="space-y-4">
      {conditions.map((condition, index) => (
        <div key={index} className="flex items-center space-x-4">
          {index > 0 && (
            <select
              value={condition.conjunction}
              onChange={(e) =>
                updateCondition(index, { conjunction: e.target.value as 'AND' | 'OR' })
              }
              className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          )}
          
          <div className="relative">
            <select
              value={condition.field}
              onChange={(e) => updateCondition(index, { field: e.target.value })}
              className="block w-40 appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {FIELDS.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={condition.operator}
              onChange={(e) => updateCondition(index, { operator: e.target.value })}
              className="block w-40 appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {OPERATORS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <input
            type="text"
            value={condition.value}
            onChange={(e) => updateCondition(index, { value: e.target.value })}
            placeholder="Value"
            className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />

          <button
            type='button'
            onClick={() => removeCondition(index)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}

      <button
      type='button'
        onClick={addCondition}
        className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
      >
        <PlusCircle className="mr-1 h-4 w-4" />
        Add condition
      </button>
    </div>
  );
}