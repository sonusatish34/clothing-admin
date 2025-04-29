import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { fetchAssignStore } from '@/services/api'; 

const ComponentName = () => {
  const { data: assignDoc, isLoading, error } = useQuery({
    queryKey: ['assign-store'],
    queryFn: fetchAssignStore,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading store data</p>;

  const StoreCard = ({ store }) => (
    <div className='pt-6'>
      <Link href={'/pending-stores-detailing'}>
        <ul className='flex flex-col gap-y-2 border-2 border-[#F5F5F5] rounded-lg'>
          <li>
            <Image
              src={store.store_image}
              alt="line"
              width={500}
              height={300}
              className='rounded-t-lg object-cover w-full h-[400px]'
            />
          </li>
          <li className='pl-4'>{store.area_name}</li>
          <li className='pl-4'>Store Id: {store._id}</li>
          <li className='pl-4 pb-4'>Submitted At {store.created_on}</li>
        </ul>
      </Link>
    </div>
  );

  return (
    <div>
      <ul className='hidden lg:flex xl:gap-x-10 lg:gap-x-2 border-2 border-[#F5F5F5] p-3 rounded-t-2xl'>
        <li className='cursor-pointer'><Link href={'/orders/confirmed'}>Pending Stores</Link></li>
        <li className='cursor-pointer'><Link href={'/returned'}>Rejected Stores</Link></li>
        <li className='cursor-pointer'>Approved Stores</li>
      </ul>
      <div className='grid grid-cols-2 gap-7'>
        {/* {assignDoc?.map((store, index) => (
          <StoreCard key={index} store={store} />
        ))} */}
        {/* {assignDoc['store_name']} */}
        {/* {assignDoc['_id']} */}
        <StoreCard store={assignDoc}/>
      </div>
    </div>
  );
};

export default ComponentName;
