export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const updatedAt = new Date(timestamp);

  const seconds = Math.floor((now.getTime() - updatedAt.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `Last updated ${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  } else if (minutes < 60) {
    return `Last updated ${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `Last updated ${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    return `Last updated ${days} day${days !== 1 ? "s" : ""} ago`;
  }
};

export const formatCreatedAt = (timestamp: string): string => {
  const now = new Date();
  const createdAt = new Date(timestamp);

  const seconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `Created ${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  } else if (minutes < 60) {
    return `Created ${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `Created ${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    return `Created ${days} day${days !== 1 ? "s" : ""} ago`;
  }
};
