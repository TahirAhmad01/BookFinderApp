import React from 'react'

function BookDetailsPageSkeleton() {
  return (
    <div className="main-details mb-8 flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 mb-4 md:mb-0 flex justify-center overflow-hidden">
        <div className="mt-6 w-full max-w-[300px] h-[500px] bg-gray-200 animate-pulse"></div>
      </div>

      <div className="w-full md:w-2/3 pl-4 flex flex-col justify-center items-center">
        <div className="w-3/4 h-8 bg-gray-200 animate-pulse mb-4"></div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 w-full"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800 w-1/3"
                    >
                      <div className="w-24 h-6 bg-gray-200 animate-pulse"></div>
                    </th>
                    <td className="px-6 py-4 w-2/3">
                      <div className="w-full h-6 bg-gray-200 animate-pulse"></div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BookDetailsPageSkeleton;