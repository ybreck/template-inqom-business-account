import React from 'react';
import { Deadline } from '../types';
import DeadlineCard from './DeadlineCard';
import { ChevronLeftIcon, ChevronRightIcon } from '../../../constants/icons';

interface DeadlinesCarouselProps {
    deadlines: Deadline[];
    onContactDeadline: (deadline: Deadline) => void;
}

const DeadlinesCarousel: React.FC<DeadlinesCarouselProps> = ({ deadlines, onContactDeadline }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Prochaines échéances</h2>
                <div className="flex space-x-2">
                    <button className="p-2 rounded-full border bg-white hover:bg-gray-100 text-gray-500">
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full border bg-white hover:bg-gray-100 text-gray-500">
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deadlines.map(deadline => (
                    <DeadlineCard key={deadline.id} deadline={deadline} onContact={onContactDeadline} />
                ))}
            </div>
        </div>
    );
};

export default DeadlinesCarousel;
