import { exportToPdf } from "@/lib/utils";

import { Button } from "@/components/ui/button"; 

const Export = () => (
  <div className='flex flex-col w-full gap-3 px-5 py-3'>
    <h3 className='text-[10px] uppercase'>Export</h3>
    <Button
      variant='outline'
      className='w-full border border-gray-500 hover:bg-blue-800 hover:text-white'
      onClick={exportToPdf}
    >
      Export to PDF
    </Button>
  </div>
);

export default Export;
