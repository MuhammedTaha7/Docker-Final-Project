import React from 'react';
import { 
  Calendar, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Settings, 
  User,
  Plus,
  Eye,
  Building2,
  Hash,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react';

// Import hooks and utilities
import { useGenerateSemester } from '../../../Hooks/useGenerateSemester';
import { 
  StatCardsContainer,
  MidPageNavbar,
  DataTable,
  PopUp,
  DynamicForm,
  getFormFieldConfigs,
  tabs,
  getTableColumns
} from '../../../Utils/GenerateSemesterUtils';

const SemesterGenerationPage = () => {
  // Use the custom hook for all state and logic
  const {
    // Data
    mockDepartments,
    currentDepartment,
    filteredStudents,
    filteredLecturers,
    filteredCourses,
    
    // Form state
    selectedDepartment,
    setSelectedDepartment,
    selectedSemester,
    setSelectedSemester,
    selectedAcademicYear,
    setSelectedAcademicYear,
    selectedDivision,
    setSelectedDivision,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    
    // UI state
    activeTab,
    setActiveTab,
    isLoading,
    showPreview,
    setShowPreview,
    showAddStudentForm,
    setShowAddStudentForm,
    showAddLecturerForm,
    setShowAddLecturerForm,
    showAddCourseForm,
    setShowAddCourseForm,
    
    // Actions
    handleGenerateSemester,
    handleAddStudent,
    handleAddLecturer,
    handleAddCourse
  } = useGenerateSemester();

  // Get form field configurations
  const { studentFormFields, lecturerFormFields, courseFormFields } = getFormFieldConfigs(currentDepartment, filteredLecturers);
  
  // Get table column configurations
  const { studentColumns, lecturerColumns, courseColumns } = getTableColumns();

  // Calculate statistics for overview
  const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
  const activeStudents = filteredStudents.filter(s => s.status === 'active').length;
  const activeLecturers = filteredLecturers.filter(l => l.status === 'active').length;
  const duration = startDate && endDate 
    ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  // Data for charts in overview
  const divisionData = currentDepartment?.divisions.map(div => ({
    division: div,
    students: filteredStudents.filter(s => s.division === div).length,
    percentage: filteredStudents.length > 0 ? Math.round((filteredStudents.filter(s => s.division === div).length / filteredStudents.length) * 100) : 0
  })) || [];

  const courseCreditsData = filteredCourses.map(course => ({
    name: course.title,
    credits: course.credits
  }));

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '32px',
        color: 'white',
        marginBottom: '32px',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <GraduationCap size={32} />
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>
              Semester Generation
            </h1>
            <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
              Configure and generate semester schedules for your college system
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
          Semester Configuration
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Department Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              Department *
            </label>
            <div style={{ position: 'relative' }}>
              <Building2 size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="">Select Department</option>
                {mockDepartments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Academic Year Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              Academic Year *
            </label>
            <div style={{ position: 'relative' }}>
              <GraduationCap size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <select
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                disabled={!currentDepartment}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: currentDepartment ? 'white' : '#f9fafb',
                  cursor: currentDepartment ? 'pointer' : 'not-allowed',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="">Select Academic Year</option>
                {currentDepartment?.academicYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Semester Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              Semester *
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="">Select Semester</option>
                <option value="Fall">Fall Semester</option>
                <option value="Spring">Spring Semester</option>
                <option value="Summer">Summer Semester</option>
              </select>
            </div>
          </div>

          {/* Division Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              Division (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <Users size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                disabled={!currentDepartment}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: currentDepartment ? 'white' : '#f9fafb',
                  cursor: currentDepartment ? 'pointer' : 'not-allowed',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="">All Divisions</option>
                {currentDepartment?.divisions.map(division => (
                  <option key={division} value={division}>Division {division}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Start Date - Enhanced with better spacing */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              Start Date *
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                zIndex: 1
              }} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px 14px 48px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* End Date - Enhanced with better spacing */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              End Date *
            </label>
            <div style={{ position: 'relative' }}>
              <Clock size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                zIndex: 1
              }} />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px 14px 48px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowPreview(!showPreview)}
            disabled={!selectedDepartment || !selectedAcademicYear || !selectedSemester}
            style={{
              padding: '12px 24px',
              backgroundColor: showPreview ? '#3b82f6' : '#f3f4f6',
              color: showPreview ? 'white' : '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: (!selectedDepartment || !selectedAcademicYear || !selectedSemester) ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Eye size={16} />
            {showPreview ? 'Hide Preview' : 'Preview Data'}
          </button>
          
          <button
            onClick={handleGenerateSemester}
            disabled={isLoading || !selectedDepartment || !selectedSemester || !selectedAcademicYear || !startDate || !endDate}
            style={{
              padding: '12px 24px',
              background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Generating...
              </>
            ) : (
              <>
                <Plus size={16} />
                Generate Semester
              </>
            )}
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {(selectedDepartment && selectedAcademicYear && selectedSemester) && (
        <StatCardsContainer
          cards={[
            {
              id: 'students',
              title: 'Total Students',
              value: filteredStudents.length,
              icon: React.createElement(Users, { size: 24 }),
              backgroundColor: '#3b82f6',
              subtitle: selectedDivision ? `Division ${selectedDivision}` : "All divisions"
            },
            {
              id: 'lecturers',
              title: 'Available Lecturers',
              value: filteredLecturers.length,
              icon: React.createElement(User, { size: 24 }),
              backgroundColor: '#10b981',
              subtitle: "Department faculty"
            },
            {
              id: 'courses',
              title: 'Course Offerings',
              value: filteredCourses.length,
              icon: React.createElement(BookOpen, { size: 24 }),
              backgroundColor: '#f59e0b',
              subtitle: `${selectedSemester} semester`
            },
            {
              id: 'credits',
              title: 'Total Credits',
              value: totalCredits,
              icon: React.createElement(GraduationCap, { size: 24 }),
              backgroundColor: '#8b5cf6',
              subtitle: "Combined courses"
            }
          ]}
          size="default"
          columns={4}
        />
      )}

      {/* Data Preview Section */}
      {showPreview && (selectedDepartment && selectedAcademicYear && selectedSemester) && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
              Semester Data Preview
            </h2>
            <button
              onClick={() => setShowPreview(false)}
              style={{
                padding: '8px',
                background: 'none',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#6b7280',
                transition: 'all 0.2s ease'
              }}
            >
              ×
            </button>
          </div>

          {/* Tab Navigation */}
          <MidPageNavbar
            activeSection={activeTab}
            setActiveSection={setActiveTab}
            sections={tabs.map(tab => tab.key)}
            showYear={false}
          />

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              {/* Header Section with Configuration Summary */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '20px',
                padding: '32px',
                color: 'white',
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
              }}>
                {/* Decorative Elements */}
                <div style={{
                  position: 'absolute',
                  top: '-100px',
                  right: '-100px',
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%)',
                  borderRadius: '50%'
                }} />
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '24px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Settings size={28} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: '28px', 
                      fontWeight: '700', 
                      color: 'white',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      Semester Configuration Overview
                    </h3>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '16px', 
                      opacity: 0.9,
                      fontWeight: '400'
                    }}>
                      {selectedSemester} {selectedAcademicYear} • {currentDepartment?.name} Department
                    </p>
                  </div>
                </div>

                {/* Configuration Details in Timeline Format */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  position: 'relative',
                  zIndex: 2,
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={18} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {currentDepartment?.name} ({currentDepartment?.code})
                    </span>
                  </div>
                  
                  <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {selectedSemester} Semester
                    </span>
                  </div>
                  
                  <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {selectedDivision ? `Division ${selectedDivision}` : 'All Divisions'}
                    </span>
                  </div>
                  
                  <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {duration} days duration
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '32px'
              }}>
                {/* Statistics Panel */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <BarChart3 size={20} style={{ color: 'white' }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      Key Metrics
                    </h3>
                  </div>

                  {/* Metrics List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Users size={20} style={{ color: '#3b82f6' }} />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                          Total Students
                        </span>
                      </div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        padding: '4px 12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        borderRadius: '8px'
                      }}>
                        {filteredStudents.length}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '12px',
                      border: '1px solid #dcfce7'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={20} style={{ color: '#10b981' }} />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                          Faculty Members
                        </span>
                      </div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        padding: '4px 12px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        borderRadius: '8px'
                      }}>
                        {filteredLecturers.length}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      backgroundColor: '#fffbeb',
                      borderRadius: '12px',
                      border: '1px solid #fde68a'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BookOpen size={20} style={{ color: '#f59e0b' }} />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                          Course Offerings
                        </span>
                      </div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        padding: '4px 12px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        borderRadius: '8px'
                      }}>
                        {filteredCourses.length}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      backgroundColor: '#faf5ff',
                      borderRadius: '12px',
                      border: '1px solid #e9d5ff'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <GraduationCap size={20} style={{ color: '#8b5cf6' }} />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                          Total Credits
                        </span>
                      </div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        padding: '4px 12px',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        borderRadius: '8px'
                      }}>
                        {totalCredits}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Division Distribution */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <PieChart size={20} style={{ color: 'white' }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      Student Distribution
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {divisionData.map((item, index) => {
                      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
                      return (
                        <div key={item.division} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px'
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: colors[index % colors.length],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            {item.division}
                          </div>
                          
                          <div style={{ flex: 1 }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '4px'
                            }}>
                              <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                                Division {item.division}
                              </span>
                              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                                {item.students} ({item.percentage}%)
                              </span>
                            </div>
                            
                            <div style={{
                              width: '100%',
                              height: '6px',
                              backgroundColor: '#e2e8f0',
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${item.percentage}%`,
                                height: '100%',
                                backgroundColor: colors[index % colors.length],
                                borderRadius: '3px',
                                transition: 'width 0.5s ease'
                              }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Course Credits Visualization */}
              {courseCreditsData.length > 0 && (
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <TrendingUp size={20} style={{ color: 'white' }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      Course Credit Distribution
                    </h3>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    {courseCreditsData.map((course, index) => {
                      const maxCredits = Math.max(...courseCreditsData.map(c => c.credits));
                      const percentage = (course.credits / maxCredits) * 100;
                      
                      return (
                        <div key={index} style={{
                          padding: '16px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                              {course.name}
                            </span>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: 'white',
                              backgroundColor: '#f59e0b',
                              padding: '2px 8px',
                              borderRadius: '6px'
                            }}>
                              {course.credits} cr
                            </span>
                          </div>
                          
                          <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#e2e8f0',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${percentage}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                              borderRadius: '4px',
                              transition: 'width 0.5s ease'
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Status Summary */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #bae6fd'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={24} style={{ color: '#0891b2' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0c4a6e' }}>
                        Configuration Status
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', color: '#0369a1' }}>
                        All required fields completed • Ready for semester generation
                      </p>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: '#0369a1'
                  }}>
                    {startDate && endDate && (
                      <>
                        <span>Duration: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</span>
                        <div style={{ width: '1px', height: '16px', backgroundColor: '#0891b2' }} />
                      </>
                    )}
                    <span>{activeStudents} Active Students</span>
                    <div style={{ width: '1px', height: '16px', backgroundColor: '#0891b2' }} />
                    <span>{activeLecturers} Active Faculty</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Users size={20} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1f2937' }}>
                      Enrolled Students
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                      {filteredStudents.length} students found for the selected criteria
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAddStudentForm(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  Add Student
                </button>
              </div>
              
              <DataTable
                data={filteredStudents}
                columns={studentColumns}
                emptyMessage="No students found for the selected criteria"
                onView={(student) => alert(`Viewing ${student.name}`)}
                onEdit={(student) => alert(`Editing ${student.name}`)}
                onDelete={(student) => alert(`Deleting ${student.name}`)}
              />
            </div>
          )}

          {activeTab === 'lecturers' && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={20} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1f2937' }}>
                      Faculty Members
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                      {filteredLecturers.length} lecturers in {currentDepartment?.name} department
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAddLecturerForm(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  Add Lecturer
                </button>
              </div>
              
              <DataTable
                data={filteredLecturers}
                columns={lecturerColumns}
                emptyMessage="No lecturers found for the selected department"
                onView={(lecturer) => alert(`Viewing ${lecturer.name}`)}
                onEdit={(lecturer) => alert(`Editing ${lecturer.name}`)}
                onDelete={(lecturer) => alert(`Deleting ${lecturer.name}`)}
              />
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpen size={20} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#1f2937' }}>
                      Course Offerings
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                      {filteredCourses.length} courses available for {selectedSemester} semester
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAddCourseForm(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={16} />
                  Add Course
                </button>
              </div>
              
              <DataTable
                data={filteredCourses}
                columns={courseColumns}
                emptyMessage="No courses found for the selected criteria"
                onView={(course) => alert(`Viewing ${course.title}`)}
                onEdit={(course) => alert(`Editing ${course.title}`)}
                onDelete={(course) => alert(`Deleting ${course.title}`)}
              />
            </div>
          )}
        </div>
      )}

      {/* Form Modals */}
      <PopUp 
        isOpen={showAddStudentForm} 
        onClose={() => setShowAddStudentForm(false)}
        title=""
        size="medium"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add New Student"
          subtitle="Enter student information for enrollment"
          icon={Users}
          fields={studentFormFields}
          onSubmit={handleAddStudent}
          onCancel={() => setShowAddStudentForm(false)}
          submitText="Add Student"
          cancelText="Cancel"
        />
      </PopUp>

      <PopUp 
        isOpen={showAddLecturerForm} 
        onClose={() => setShowAddLecturerForm(false)}
        title=""
        size="medium"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add New Lecturer"
          subtitle="Enter lecturer information and specialization"
          icon={User}
          fields={lecturerFormFields}
          onSubmit={handleAddLecturer}
          onCancel={() => setShowAddLecturerForm(false)}
          submitText="Add Lecturer"
          cancelText="Cancel"
        />
      </PopUp>

      <PopUp 
        isOpen={showAddCourseForm} 
        onClose={() => setShowAddCourseForm(false)}
        title=""
        size="medium"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add New Course"
          subtitle="Create a new course offering for the semester"
          icon={BookOpen}
          fields={courseFormFields}
          onSubmit={handleAddCourse}
          onCancel={() => setShowAddCourseForm(false)}
          submitText="Add Course"
          cancelText="Cancel"
        />
      </PopUp>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes slideDown {
            0% { 
              opacity: 0;
              transform: translateY(-20px);
            }
            100% { 
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SemesterGenerationPage;