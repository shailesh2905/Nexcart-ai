import React from 'react';

const Message = ({ variant, children }) => {
    const getVariantColor = (v) => {
        switch (v) {
            case 'danger': return '#fecaca';
            case 'success': return '#bbf7d0';
            case 'warning': return '#fef08a';
            default: return '#e0e7ff';
        }
    };

    const getTextColor = (v) => {
        switch (v) {
            case 'danger': return '#b91c1c';
            case 'success': return '#15803d';
            case 'warning': return '#a16207';
            default: return '#4338ca';
        }
    };

    return (
        <div style={{
            padding: '1rem 1.5rem',
            backgroundColor: getVariantColor(variant),
            color: getTextColor(variant),
            borderRadius: '8px',
            margin: '1rem 0',
            fontWeight: '500'
        }}>
            {children}
        </div>
    );
};

Message.defaultProps = {
    variant: 'info',
};

export default Message;
