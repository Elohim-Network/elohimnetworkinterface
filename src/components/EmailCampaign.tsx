
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  notes: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  createdAt: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: number;
}

const EmailCampaign: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState<Omit<EmailTemplate, 'id' | 'createdAt'>>({
    name: '',
    subject: '',
    body: ''
  });
  const [customEmail, setCustomEmail] = useState({
    subject: '',
    body: ''
  });
  
  // Load leads and templates from localStorage on component mount
  useEffect(() => {
    // Load leads
    const savedLeads = localStorage.getItem('elohim-leads');
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch (e) {
        console.error('Error loading leads:', e);
      }
    }
    
    // Load templates
    const savedTemplates = localStorage.getItem('elohim-email-templates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (e) {
        console.error('Error loading email templates:', e);
      }
    } else {
      // Create default templates if none exist
      const defaultTemplates: EmailTemplate[] = [
        {
          id: '1',
          name: 'Initial Contact',
          subject: 'Introduction and Services Inquiry',
          body: `Hello {{name}},

I hope this email finds you well. I recently came across {{company}} and was impressed by your work.

I'm reaching out because my company specializes in AI-powered solutions that might align with your needs. We've helped similar businesses increase efficiency and reduce costs.

Would you be open to a quick 15-minute call to discuss how we might be able to support your goals?

Best regards,
[Your Name]
[Your Company]`,
          createdAt: Date.now()
        },
        {
          id: '2',
          name: 'Follow Up',
          subject: 'Following up on our previous conversation',
          body: `Hello {{name}},

I wanted to follow up on our previous conversation about how our AI solutions might benefit {{company}}.

Have you had a chance to consider the ideas we discussed? I'd be happy to provide any additional information or clarification you might need.

Looking forward to hearing from you.

Best regards,
[Your Name]
[Your Company]`,
          createdAt: Date.now()
        }
      ];
      
      setTemplates(defaultTemplates);
      localStorage.setItem('elohim-email-templates', JSON.stringify(defaultTemplates));
    }
  }, []);
  
  // Save templates to localStorage when they change
  useEffect(() => {
    localStorage.setItem('elohim-email-templates', JSON.stringify(templates));
  }, [templates]);
  
  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
      toast.error('All fields are required');
      return;
    }
    
    const template: EmailTemplate = {
      ...newTemplate,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    
    setTemplates(prev => [...prev, template]);
    setNewTemplate({
      name: '',
      subject: '',
      body: ''
    });
    
    toast.success('Email template created successfully');
  };
  
  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
    if (selectedTemplate === id) {
      setSelectedTemplate(null);
    }
    toast.success('Template deleted successfully');
  };
  
  const handleSelectAllLeads = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };
  
  const handleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(prev => prev.filter(leadId => leadId !== id));
    } else {
      setSelectedLeads(prev => [...prev, id]);
    }
  };
  
  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    const template = templates.find(t => t.id === id);
    if (template) {
      setCustomEmail({
        subject: template.subject,
        body: template.body
      });
    }
  };
  
  const personalizeEmail = (template: string, lead: Lead) => {
    return template
      .replace(/{{name}}/g, lead.name)
      .replace(/{{email}}/g, lead.email)
      .replace(/{{company}}/g, lead.company || 'your company');
  };
  
  const handleSendEmails = async () => {
    if (selectedLeads.length === 0) {
      toast.error('Please select at least one lead');
      return;
    }
    
    if (!customEmail.subject || !customEmail.body) {
      toast.error('Email subject and body are required');
      return;
    }
    
    // In a real implementation, you would integrate with an email service API here
    // For demonstration, we'll simulate sending emails
    toast.info(`Preparing to send ${selectedLeads.length} emails...`);
    
    const selectedLeadsData = leads.filter(lead => selectedLeads.includes(lead.id));
    
    // Simulate sending with a delay
    for (let i = 0; i < selectedLeadsData.length; i++) {
      const lead = selectedLeadsData[i];
      
      // Update UI to show progress
      toast.loading(`Sending email to ${lead.email}... (${i + 1}/${selectedLeadsData.length})`, {
        id: `sending-${i}`
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the lead status to 'contacted'
      const updatedLeads = leads.map(l => 
        l.id === lead.id ? { ...l, status: 'contacted' as const } : l
      );
      
      setLeads(updatedLeads);
      localStorage.setItem('elohim-leads', JSON.stringify(updatedLeads));
      
      toast.success(`Email sent to ${lead.email}`, {
        id: `sending-${i}`
      });
    }
    
    toast.success(`All ${selectedLeadsData.length} emails have been sent`);
    
    // Show implementation notice
    toast.info('Note: This is a simulation. To send real emails, you would need to integrate with an email service API.');
  };
  
  const exportEmailsAsMailto = () => {
    if (selectedLeads.length === 0) {
      toast.error('Please select at least one lead');
      return;
    }
    
    const selectedLeadsData = leads.filter(lead => selectedLeads.includes(lead.id));
    const emails = selectedLeadsData.map(lead => lead.email).join(',');
    const subject = encodeURIComponent(customEmail.subject);
    const body = encodeURIComponent(customEmail.body);
    
    // Create mailto link
    const mailtoLink = `mailto:?bcc=${emails}&subject=${subject}&body=${body}`;
    
    // Open the link in a new tab
    window.open(mailtoLink, '_blank');
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Email Campaign</h2>
      
      <Tabs defaultValue="compose">
        <TabsList className="mb-6">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose" className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Select Recipients</h3>
            
            {leads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No leads available. Please add leads first.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-muted-foreground">
                    {selectedLeads.length} of {leads.length} leads selected
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSelectAllLeads}
                  >
                    {selectedLeads.length === leads.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                
                <div className="max-h-60 overflow-y-auto border rounded">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-12 px-3 py-2"></th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <input 
                              type="checkbox"
                              checked={selectedLeads.includes(lead.id)}
                              onChange={() => handleSelectLead(lead.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-3 py-2">{lead.name}</td>
                          <td className="px-3 py-2">{lead.email}</td>
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {lead.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Compose Email</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email Template</label>
              <select 
                className="w-full p-2 border rounded"
                value={selectedTemplate || ''}
                onChange={(e) => handleTemplateSelect(e.target.value)}
              >
                <option value="">Select a template</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Input
                value={customEmail.subject}
                onChange={(e) => setCustomEmail({...customEmail, subject: e.target.value})}
                placeholder="Email subject"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Body</label>
              <Textarea
                value={customEmail.body}
                onChange={(e) => setCustomEmail({...customEmail, body: e.target.value})}
                placeholder="Email body"
                rows={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can use placeholders like {{'{'}}{'{name}'}{'}'}}, {{'{'}}{'{email}'}{'}'}}, and {{'{'}}{'{company}'}}{'}'}}.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={exportEmailsAsMailto}
                disabled={selectedLeads.length === 0}
              >
                Open in Email Client
              </Button>
              <Button 
                onClick={handleSendEmails}
                disabled={selectedLeads.length === 0}
              >
                Send Emails
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
              <p>
                <strong>Note:</strong> This is a simulation. To send real emails, you would need to integrate with an email service (like SendGrid, Mailchimp, etc.) or set up an SMTP service.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Email Templates</h3>
              
              {templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No templates available. Create your first template.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {templates.map(template => (
                    <div key={template.id} className="border rounded p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{template.name}</h4>
                        <div className="flex space-x-2">
                          <button 
                            className="text-xs text-blue-600 hover:underline"
                            onClick={() => handleTemplateSelect(template.id)}
                          >
                            Use
                          </button>
                          <button 
                            className="text-xs text-red-600 hover:underline"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-medium mt-1">{template.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {template.body.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Create New Template</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Template Name</label>
                  <Input
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    placeholder="e.g., Follow-up Email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <Input
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                    placeholder="Email subject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Body</label>
                  <Textarea
                    value={newTemplate.body}
                    onChange={(e) => setNewTemplate({...newTemplate, body: e.target.value})}
                    placeholder="Email body"
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can use placeholders like {{'{'}}{'{name}'}{'}'}}, {{'{'}}{'{email}'}{'}'}}, and {{'{'}}{'{company}'}}{'}'}}.
                  </p>
                </div>
                
                <Button onClick={handleCreateTemplate} className="w-full">
                  Create Template
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailCampaign;
