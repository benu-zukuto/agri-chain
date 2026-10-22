const StatusBadge = ({ status }) => {
  const statusColors = {
    'Created': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'AtCollectionCenter': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'AtRetailer': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'Sold': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Available': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Processed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'default': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  const colorClass = statusColors[status] || statusColors['default'];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
