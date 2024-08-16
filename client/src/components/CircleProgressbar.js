import React from 'react'

function CircleProgressbar({progress, size=100, strokeWidth=10}) {

    const center = size /2;
    const radius = center - strokeWidth /2;
    const circumference = 2 * Math.PI * radius
    const strokeDashOffset = circumference - (progress / 100) * circumference;



  return (
   <svg width={size} height={size}>

        <circle
            cx = {center}
            cy={center}
            r={radius}
            stroke="lightgray"
            fill = "transparent"
            strokeWidth={strokeWidth}
        />
            <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#0060ef"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashOffset}
                style={{transition:"stroke-dashoffset 0.5s ease"}}
                strokeLinecap='round'
            />

           <text x="50%" y="50%" dominantBaseline="middle" textAnchor='middle' fontSize="20px" fill='black'>{`${progress}%`}</text>
        

   </svg>
  )
}

export default CircleProgressbar