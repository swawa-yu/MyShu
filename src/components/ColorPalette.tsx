import React from 'react';

interface ColorPaletteProps {
    selectedColor: string;
    onSelectColor: (color: string) => void;
}

const colors = [
    { bg: 'bg-red-500', hover: 'hover:bg-red-700', text: 'text-white', value: '#f56565' },
    { bg: 'bg-green-500', hover: 'hover:bg-green-700', text: 'text-white', value: '#48bb78' },
    { bg: 'bg-blue-500', hover: 'hover:bg-blue-700', text: 'text-white', value: '#4299e1' },
    // 他の色も追加
];

const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onSelectColor }) => {
    return (
        <div className="flex space-x-2">
            {colors.map(color => (
                <button
                    key={color.value}
                    className={`w-8 h-8 ${color.bg} ${color.hover} ${color.text} ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => onSelectColor(color.value)}
                />
            ))}
        </div>
    );
};

export default ColorPalette;
