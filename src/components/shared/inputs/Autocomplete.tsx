import React, { useState, useRef, useEffect } from 'react';
import { Input, ListGroup, ListGroupItem } from 'reactstrap';

type AutocompleteOption = {
    value: string;
    label: string;
};

interface AutocompleteProps {
    options: AutocompleteOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
    required?: boolean;
}

export default function Autocomplete({ options, value, onChange, placeholder = 'Escriba para buscar...', id, required }: AutocompleteProps) {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : query;

    const filtered = query
        ? options.filter(opt =>
            opt.label.toLowerCase().includes(query.toLowerCase()) ||
            opt.value.toLowerCase().includes(query.toLowerCase())
        )
        : options;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: AutocompleteOption) => {
        onChange(option.value);
        setQuery('');
        setShowDropdown(false);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown || filtered.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            handleSelect(filtered[highlightedIndex]);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative' }}>
            <Input
                id={id}
                type="text"
                value={displayValue}
                placeholder={placeholder}
                required={required && !value}
                autoComplete="off"
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                    setHighlightedIndex(-1);
                    if (!e.target.value && value) {
                        onChange('');
                    }
                }}
                onKeyDown={handleKeyDown}
            />
            {showDropdown && filtered.length > 0 && (
                <ListGroup
                    style={{
                        position: 'absolute',
                        zIndex: 1050,
                        width: '100%',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        marginTop: '2px',
                    }}
                >
                    {filtered.map((option, index) => (
                        <ListGroupItem
                            key={option.value}
                            active={index === highlightedIndex}
                            onClick={() => handleSelect(option)}
                            style={{ cursor: 'pointer', padding: '8px 12px' }}
                        >
                            {option.label}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            )}
        </div>
    );
}
