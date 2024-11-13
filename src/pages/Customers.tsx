import React from 'react';
import { format } from 'date-fns';
import { Mail, Phone, DollarSign, Calendar } from 'lucide-react';
import { useCRMStore } from '../store';

export default function Customers() {
  const { customers } = useCRMStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {customers.length === 0 ? (
            <li className="p-6 text-center text-gray-500">No customers found</li>
          ) : (
            customers.map((customer) => (
              <li key={customer.id} className="px-6 py-5 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-indigo-600">
                          {customer.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-medium text-gray-900">
                          {customer.name}
                        </h2>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-8">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-medium">{customer.totalSpending}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">Total Spent</div>
                    </div>
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{customer.visitCount}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">Visits</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Last visit: {format(new Date(customer.lastVisit), 'PPp')}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}