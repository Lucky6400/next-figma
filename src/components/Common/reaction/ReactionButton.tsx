import React from "react";

type Props = {
  setReaction: (reaction: string) => void;
};

const ReactionSelector = ({ setReaction }: Props) => (
  <div
    className='absolute bottom-20 left-0 right-0 mx-auto w-fit transform rounded-full bg-blue-800 px-2'
    onPointerMove={(e) => e.stopPropagation()}
  >
    <ReactionButton reaction='👍' onSelect={setReaction} />
    <ReactionButton reaction='🔥' onSelect={setReaction} />
    <ReactionButton reaction='😍' onSelect={setReaction} />
    <ReactionButton reaction='👀' onSelect={setReaction} />
    <ReactionButton reaction='😱' onSelect={setReaction} />
    <ReactionButton reaction='🙁' onSelect={setReaction} />
  </div>
);

type ReactionButtonProps = {
  reaction: string;
  onSelect: (reaction: string) => void;
};

const ReactionButton = ({ reaction, onSelect }: ReactionButtonProps) => (
  <button
    className='transform select-none px-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none'
    onPointerDown={() => onSelect(reaction)}
  >
    {reaction}
  </button>
);

export default ReactionSelector;
