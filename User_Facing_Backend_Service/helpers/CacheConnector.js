import cluster from 'cluster';
import clusterNodeCache from 'cluster-node-cache';

const inMemoryCache = clusterNodeCache(cluster);

export const cache = inMemoryCache;