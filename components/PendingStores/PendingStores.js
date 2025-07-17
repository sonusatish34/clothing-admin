import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { fetchAssignStore } from '@/services/api';

const ComponentName = () => {


  const [data, setData] = React.useState([]);
  const [status, setStatus] = React.useState('in_progress');
  const [role, setRole] = React.useState('');
  useEffect(() => {
  }, [])
  // console.log(role,"olee");

  useEffect(() => {
    localStorage.getItem('user_role_id') == '5' ? setRole('approval') : setRole('admin')

    async function fetchStores() {
      const response = await fetch(`https://ecommstagingapis.tboo.com/admin/assign-store`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_user_id: 27,
          role_id: 5,
        }),
      });

      const data = await response.json();
      setData(data?.data?.results);
      console.log(data?.data?.results, "9998data");
    }
    
    if (localStorage.getItem('user_role_id') == '5') {

      fetchStores()
    }




  }, [status])

  const StoreCard = ({ store }) => (
    <div className='pt-6'>
      <Link href={'/pending-stores-detailing'}>
        <ul className='flex flex-col gap-y-2 border-2 border-[#F5F5F5] rounded-lg'>
          <li>
            <Image
              src={store?.store_image?.includes('ldcars') ? store.store_image : 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iOeosYVL8qds/v0/-1x-1.webp'}
              alt="line"
              width={500}
              height={300}
              className='rounded-t-lg object-cover w-full h-[400px]'
            />
          </li>
          <li className='pl-4'>{store?.area_name}</li>
          <li className='pl-4'>Store Id: {store?._id}</li>
          <li className='pl-4 pb-4'>Submitted At {store?.created_on}</li>
        </ul>
      </Link>
    </div>
  );

  return (
    <div>
      <ul className='hidden lg:flex xl:gap-x-10 lg:gap-x-2 border-2 border-[#F5F5F5] p-3 rounded-t-2xl'>
        <li className={` cursor-pointer ${status === 'in_progress' ? 'text-[#793FDF]' : ''}`}><p onClick={() => { setStatus('in_progress') }} href={'/'}>Pending Stores</p></li>
        <li className={` cursor-pointer ${status === 'rejected' ? 'text-[#793FDF]' : ''}`}><p onClick={() => { setStatus('rejected') }} href={'/'}>Rejected Stores</p></li>
        <li className={` cursor-pointer ${status === 'approved' ? 'text-[#793FDF]' : ''}`}><p onClick={() => { setStatus('approved') }} href={'/'}>Approved Stores</p></li>
      </ul>
      {console.log(data, 'data12d')}
      <div className='grid grid-cols-2 gap-7'>
        {role == 'approval' && data?._id ? <StoreCard store={data} /> : 'No properties assigned'}
        {role == 'admin' &&

          data.map((item, index) => (
            <div key={index} className=''>
              <StoreCard store={item} />
            </div>
          ))
        }
        {console.log(role, 'rlw')
        }
      </div>
    </div>
  );
};

export default ComponentName;
