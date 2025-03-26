import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, Area, AreaChart
} from 'recharts';
import { fadeIn, staggerContainer } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { GrassCard } from '@/components/ui/grass-card';

// Define our metrics data
const techSkillsData = [
  { name: 'AI', value: 85 },
  { name: 'Big Data', value: 90 },
  { name: 'ML', value: 80 },
  { name: 'Web Dev', value: 95 },
  { name: 'E-commerce', value: 88 },
  { name: 'Digital Mkt', value: 75 },
];

const projectsCompletedData = [
  { name: '2020', AI: 12, WebDev: 18, ECommerce: 10, BigData: 8 },
  { name: '2021', AI: 19, WebDev: 22, ECommerce: 15, BigData: 14 },
  { name: '2022', AI: 25, WebDev: 30, ECommerce: 22, BigData: 19 },
  { name: '2023', AI: 35, WebDev: 28, ECommerce: 30, BigData: 25 },
  { name: '2024', AI: 42, WebDev: 32, ECommerce: 38, BigData: 31 },
];

const clientSatisfactionData = [
  { name: 'Q1', satisfaction: 88 },
  { name: 'Q2', satisfaction: 90 },
  { name: 'Q3', satisfaction: 93 },
  { name: 'Q4', satisfaction: 96 },
];

const marketSegmentationData = [
  { name: 'Tech Startups', value: 35 },
  { name: 'Enterprise', value: 30 },
  { name: 'E-Commerce', value: 20 },
  { name: 'Healthcare', value: 15 },
];

const COLORS = ['#2f72df', '#4287f5', '#5a9aff', '#7eb2ff', '#a1c9ff', '#c4e0ff'];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
        <p className="font-bold">{label}</p>
        <p className="text-primary">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function DataVisualizationSection() {
  // Ref for intersection observer for metric counters
  const metricsSectionRef = React.useRef(null);
  const [shouldAnimateCounters, setShouldAnimateCounters] = useState(false);
  
  const [animatedData, setAnimatedData] = useState(techSkillsData.map(item => ({ ...item, value: 0 })));
  const [activeIndex, setActiveIndex] = useState(0);
  const [showChart, setShowChart] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [retentionCount, setRetentionCount] = useState(0);
  const [teamGrowthCount, setTeamGrowthCount] = useState(0);
  const [techStackCount, setTechStackCount] = useState(0);
  
  // IntersectionObserver for counters - detects when metrics section comes into view
  useEffect(() => {
    if (!metricsSectionRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setShouldAnimateCounters(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    
    observer.observe(metricsSectionRef.current);
    return () => {
      if (metricsSectionRef.current) {
        observer.unobserve(metricsSectionRef.current);
      }
    };
  }, []);
  
  // Animation for bar chart data
  useEffect(() => {
    // Reset chart data when section is not visible
    if (!shouldAnimateCounters) {
      setAnimatedData(techSkillsData.map(item => ({ ...item, value: 0 })));
      return;
    }
    
    const interval = setInterval(() => {
      setAnimatedData(current => {
        // Skip update if already at max values
        const allFilled = current.every((item, index) => 
          item.value >= techSkillsData[index].value
        );
        
        if (allFilled) {
          clearInterval(interval);
          return current;
        }
        
        return current.map((item, index) => ({
          ...item,
          value: Math.min(item.value + 5, techSkillsData[index].value)
        }));
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [shouldAnimateCounters]); // Remove animatedData from dependencies
  
  // Cycle through pie chart segments
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % marketSegmentationData.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Cycle through different charts
  useEffect(() => {
    const interval = setInterval(() => {
      setShowChart(prev => (prev + 1) % 4);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Counter animation for stats using framer-motion animate functionality
  useEffect(() => {
    // Reset counters when not in view
    if (!shouldAnimateCounters) {
      setProjectsCount(0);
      setRetentionCount(0);
      setTeamGrowthCount(0);
      setTechStackCount(0);
      return;
    }
    
    // Using a setTimeout to allow the component to render first
    const animationTimeout = setTimeout(() => {
      // Start all the counting animations
      let count = 0;
      const animationDuration = 2000; // ms
      const interval = 16; // ms
      
      const totalSteps = animationDuration / interval;
      const projectsIncrement = 200 / totalSteps;
      const retentionIncrement = 94 / totalSteps;
      const teamGrowthIncrement = 45 / totalSteps;
      const techStackIncrement = 12 / totalSteps;
      
      const timer = setInterval(() => {
        count++;
        
        // Update all counters
        setProjectsCount(Math.min(200, Math.floor(projectsIncrement * count)));
        setRetentionCount(Math.min(94, Math.floor(retentionIncrement * count)));
        setTeamGrowthCount(Math.min(45, Math.floor(teamGrowthIncrement * count)));
        setTechStackCount(Math.min(12, Math.floor(techStackIncrement * count)));
        
        // Clear interval when animation completes
        if (count >= totalSteps) {
          clearInterval(timer);
          
          // Ensure final values are set exactly
          setProjectsCount(200);
          setRetentionCount(94);
          setTeamGrowthCount(45);
          setTechStackCount(12);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }, 500);
    
    return () => clearTimeout(animationTimeout);
  }, [shouldAnimateCounters]);
  
  const chartAnimationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <section id="data-visualization" className="py-20 bg-background" ref={metricsSectionRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
        >
          <motion.h2 
            variants={fadeIn('up', 'tween', 0.1, 1)}
            className="text-4xl font-bold mb-4 font-heading"
          >
            Our Tech <span className="text-primary">Metrics</span>
          </motion.h2>
          <motion.p 
            variants={fadeIn('up', 'tween', 0.2, 1)}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Explore our performance and expertise through interactive data visualizations. 
            These metrics showcase our technical capabilities and project success rates.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Main Visualization */}
          <motion.div
            variants={fadeIn('right', 'tween', 0.2, 1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className="flex flex-col"
          >
            <GrassCard className="p-8 h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-6 font-heading">
                {showChart === 0 && "Technology Expertise"}
                {showChart === 1 && "Projects Completed"}
                {showChart === 2 && "Client Satisfaction"}
                {showChart === 3 && "Market Segmentation"}
              </h3>
              
              <div className="relative h-80 w-full">
                {/* Skills Bar Chart */}
                <motion.div 
                  className={cn("absolute inset-0", { "opacity-0": showChart !== 0 })}
                  key="chart-0"
                  initial="hidden"
                  animate={showChart === 0 ? "visible" : "exit"}
                  variants={chartAnimationVariants}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={animatedData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      layout="vertical"
                    >
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" scale="band" width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="value" 
                        fill="#2f72df"
                        background={{ fill: '#eee' }}
                        animationDuration={500}
                        barSize={20}
                        radius={[5, 5, 5, 5]}
                      >
                        {animatedData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
                
                {/* Projects Line Chart */}
                <motion.div 
                  className={cn("absolute inset-0", { "opacity-0": showChart !== 1 })}
                  key="chart-1"
                  initial="hidden"
                  animate={showChart === 1 ? "visible" : "exit"}
                  variants={chartAnimationVariants}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={projectsCompletedData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="AI" 
                        stroke="#2f72df" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                        animationDuration={1000}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="WebDev" 
                        stroke="#4287f5" 
                        strokeWidth={2}
                        animationDuration={1500}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ECommerce" 
                        stroke="#5a9aff" 
                        strokeWidth={2}
                        animationDuration={2000}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="BigData" 
                        stroke="#7eb2ff" 
                        strokeWidth={2}
                        animationDuration={2500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
                
                {/* Satisfaction Area Chart */}
                <motion.div 
                  className={cn("absolute inset-0", { "opacity-0": showChart !== 2 })}
                  key="chart-2"
                  initial="hidden"
                  animate={showChart === 2 ? "visible" : "exit"}
                  variants={chartAnimationVariants}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={clientSatisfactionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="satisfaction" 
                        stroke="#2f72df" 
                        fill="url(#colorSatisfaction)" 
                        animationDuration={1000}
                      />
                      <defs>
                        <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2f72df" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2f72df" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
                
                {/* Market Pie Chart */}
                <motion.div 
                  className={cn("absolute inset-0", { "opacity-0": showChart !== 3 })}
                  key="chart-3"
                  initial="hidden"
                  animate={showChart === 3 ? "visible" : "exit"}
                  variants={chartAnimationVariants}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketSegmentationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#2f72df"
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {marketSegmentationData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            stroke="none"
                            opacity={index === activeIndex ? 1 : 0.7}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
              
              <div className="flex justify-center mt-6 space-x-2">
                {[0, 1, 2, 3].map((index) => (
                  <button
                    key={`indicator-${index}`}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      showChart === index ? "bg-primary scale-125" : "bg-gray-300"
                    )}
                    onClick={() => setShowChart(index)}
                    aria-label={`Show chart ${index + 1}`}
                  />
                ))}
              </div>
            </GrassCard>
          </motion.div>
          
          {/* Right Column - Stats and Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Stat 1 - Projects Completed */}
            <motion.div
              variants={fadeIn('up', 'tween', 0.3, 1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.25 }}
            >
              <GrassCard className="p-6 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-1 font-heading">Projects Completed</h4>
                  <div className="relative w-full h-12 flex items-center justify-center">
                    <motion.span 
                      className="text-4xl font-bold text-primary"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                      }}
                    >
                      {projectsCount}+
                    </motion.span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">
                    Successful projects delivered across industry verticals
                  </p>
                </div>
              </GrassCard>
            </motion.div>
            
            {/* Key Stat 2 - Client Retention */}
            <motion.div
              variants={fadeIn('up', 'tween', 0.4, 1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.25 }}
            >
              <GrassCard className="p-6 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2z"></path>
                      <path d="M7 6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2z"></path>
                      <path d="M7 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2z"></path>
                      <path d="m16 7 .7.7a1 1 0 0 0 1.4-1.4l-2.1-2.1a1 1 0 0 0-1.4 1.4l.7.7"></path>
                      <path d="m16 17 .7.7a1 1 0 0 1-1.4 1.4l-2.1-2.1a1 1 0 0 1 1.4-1.4l.7.7"></path>
                      <path d="M9 12h6"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-1 font-heading">Client Retention</h4>
                  <div className="relative w-full h-12 flex items-center justify-center">
                    <motion.span 
                      className="text-4xl font-bold text-primary"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.3
                      }}
                    >
                      {retentionCount}%
                    </motion.span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">
                    Long-term partnerships with satisfied clients
                  </p>
                </div>
              </GrassCard>
            </motion.div>
            
            {/* Key Stat 3 - Team Growth */}
            <motion.div
              variants={fadeIn('up', 'tween', 0.5, 1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.25 }}
            >
              <GrassCard className="p-6 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-1 font-heading">Team Growth</h4>
                  <div className="relative w-full h-12 flex items-center justify-center">
                    <motion.span 
                      className="text-4xl font-bold text-primary"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.4
                      }}
                    >
                      +{teamGrowthCount}%
                    </motion.span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">
                    Annual team expansion with specialized talent
                  </p>
                </div>
              </GrassCard>
            </motion.div>
            
            {/* Key Stat 4 - Technology Adoption */}
            <motion.div
              variants={fadeIn('up', 'tween', 0.6, 1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.25 }}
            >
              <GrassCard className="p-6 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v8"></path>
                      <path d="m4.93 10.93 1.41 1.41"></path>
                      <path d="M2 18h2"></path>
                      <path d="M20 18h2"></path>
                      <path d="m19.07 10.93-1.41 1.41"></path>
                      <path d="M22 22H2"></path>
                      <path d="M16 16a4 4 0 0 1-8 0"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-1 font-heading">Tech Stack Growth</h4>
                  <div className="relative w-full h-12 flex items-center justify-center">
                    <motion.span 
                      className="text-4xl font-bold text-primary"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.5
                      }}
                    >
                      {techStackCount}
                    </motion.span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">
                    New technologies integrated in the last year
                  </p>
                </div>
              </GrassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}