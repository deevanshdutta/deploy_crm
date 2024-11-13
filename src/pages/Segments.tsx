import React, { useState } from 'react';
import { Target, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useCRMStore } from '../store';
import { Segment, SegmentCondition } from '../types';
import SegmentBuilder, { FIELDS, OPERATORS } from '../components/SegmentBuilder';

interface SegmentForm {
  name: string;
}

export default function Segments() {
  const { segments, addSegment, customers } = useCRMStore();
  const [conditions, setConditions] = useState<SegmentCondition[]>([]);
  const { register, handleSubmit, reset } = useForm<SegmentForm>();

  const calculateAudienceSize = (conditions: SegmentCondition[]): number => {
    if (conditions.length === 0) return 0;

    return customers.filter((customer) => {
      let result = true;
      let currentResult = true;

      for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];
        const value = customer[condition.field as keyof typeof customer];
        const conditionValue = condition.value;

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
    }).length;
  };

  const onSubmit = (data: SegmentForm) => {
    const newSegment: Segment = {
      id: crypto.randomUUID(),
      name: data.name,
      conditions,
      audienceSize: calculateAudienceSize(conditions),
      createdAt: new Date().toISOString(),
    };
    addSegment(newSegment);
    reset();
    setConditions([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Segments</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Segment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Segment Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="High-value customers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conditions
            </label>
            <SegmentBuilder conditions={conditions} onChange={setConditions} />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <span>Estimated audience size: </span>
              <span className="ml-1 font-medium">{calculateAudienceSize(conditions)}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Segment
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Existing Segments</h2>
        </div>
        {segments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No segments created yet</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {segments.map((segment) => (
              <div key={segment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{segment.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Created {new Date(segment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="h-5 w-5 mr-1.5" />
                      <span>{segment.audienceSize} customers</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {segment.conditions.map((condition, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {index > 0 && (
                        <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs mr-2">
                          {condition.conjunction}
                        </span>
                      )}
                      <span>{FIELDS.find(f => f.value === condition.field)?.label}</span>
                      <span className="mx-1">
                        {OPERATORS.find(op => op.value === condition.operator)?.label}
                      </span>
                      <span className="font-medium">{condition.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}