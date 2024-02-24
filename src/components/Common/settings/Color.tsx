import { Label } from "@/components/ui/label";

type Props = {
  inputRef: any;
  attribute: string;
  placeholder: string;
  attributeType: string;
  handleInputChange: (property: string, value: string) => void;
  opacity?: number
};

const Color = ({
  inputRef,
  attribute,
  placeholder,
  attributeType,
  handleInputChange,
  opacity
}: Props) => (

  <div className='flex w-full flex-col gap-3 border-b border-gray-400 p-5 text-black'>
    <h3 className='text-[10px] uppercase'>{placeholder}</h3>
    <div
      className='flex items-center gap-2 border border-gray-400'
      onClick={() => inputRef.current.click()}
    >
      <input
        type='color'
        value={attribute}
        ref={inputRef}
        onChange={(e) => handleInputChange(attributeType, e.target.value)}
      />
      <Label className='flex-1'>{attribute}</Label>
      {opacity ?
       <input type="number" value={opacity} className='w-16 focus: outline-none border-l px-1 border-black' min={0} max={1} step={0.01} onChange={e => handleInputChange("opacity", e.target.value)} />
      : <></>}
     
    </div>
  </div>
);

export default Color;
