import React from 'react';
import Layout from '@/components/Layout/Layout';
import TotalStores from '../components/TotalStores/TotalStores'
const ComponentName = (props) => {
  return (
    <Layout>
      <div className="">
        {/* <PendingStores /> */}
        <TotalStores />
      </div>
    </Layout>
  );
};

export default ComponentName;