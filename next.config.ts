/** @type {import('next').NextConfig} */
const nextConfig = {}
 
import withBundleAnalyzer from '@next/bundle-analyzer'
 
module.exports = {...nextConfig, ...withBundleAnalyzer({
  enabled: true,
})}