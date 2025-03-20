
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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

const LeadsManagement: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newLead, setNewLead] = useState<Omit<Lead, 'id' | 'createdAt'>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'manual',
    notes: '',
    status: 'new'
  });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Load leads from localStorage on component mount
  useEffect(() => {
    const savedLeads = localStorage.getItem('elohim-leads');
    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch (e) {
        console.error('Error loading leads:', e);
      }
    }
  }, []);

  // Save leads to localStorage when they change
  useEffect(() => {
    localStorage.setItem('elohim-leads', JSON.stringify(leads));
  }, [leads]);

  const handleAddLead = () => {
    if (!newLead.name || !newLead.email) {
      toast.error('Name and email are required');
      return;
    }

    const lead: Lead = {
      ...newLead,
      id: Date.now().toString(),
      createdAt: Date.now()
    };

    setLeads(prev => [lead, ...prev]);
    setNewLead({
      name: '',
      email: '',
      phone: '',
      company: '',
      source: 'manual',
      notes: '',
      status: 'new'
    });
    setIsAdding(false);
    toast.success('Lead added successfully');
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
    setSelectedLead(null);
    toast.success('Lead updated successfully');
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
    setSelectedLead(null);
    toast.success('Lead deleted successfully');
  };

  const handleImportLeads = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        
        const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name'));
        const emailIndex = headers.findIndex(h => h.toLowerCase().includes('email'));
        const phoneIndex = headers.findIndex(h => h.toLowerCase().includes('phone'));
        const companyIndex = headers.findIndex(h => h.toLowerCase().includes('company'));
        
        if (nameIndex === -1 || emailIndex === -1) {
          toast.error('CSV must include name and email columns');
          return;
        }

        const importedLeads: Lead[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',');
          const lead: Lead = {
            id: Date.now().toString() + i,
            name: values[nameIndex].trim(),
            email: values[emailIndex].trim(),
            phone: phoneIndex !== -1 ? values[phoneIndex].trim() : '',
            company: companyIndex !== -1 ? values[companyIndex].trim() : '',
            source: 'import',
            notes: 'Imported from CSV',
            status: 'new',
            createdAt: Date.now()
          };
          
          importedLeads.push(lead);
        }
        
        setLeads(prev => [...importedLeads, ...prev]);
        toast.success(`Imported ${importedLeads.length} leads`);
      } catch (e) {
        console.error('Error importing CSV:', e);
        toast.error('Failed to import CSV. Check the file format.');
      }
    };
    
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Leads Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? 'Cancel' : 'Add Lead'}
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline">Import CSV</Button>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImportLeads}
            />
          </label>
        </div>
      </div>
      
      {isAdding && (
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name*</label>
              <Input
                value={newLead.name}
                onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email*</label>
              <Input
                value={newLead.email}
                onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                placeholder="Email Address"
                type="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                value={newLead.phone}
                onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                placeholder="Phone Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <Input
                value={newLead.company}
                onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                placeholder="Company"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Textarea
              value={newLead.notes}
              onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
              placeholder="Add notes about this lead"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleAddLead}>
              Save Lead
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <div className="w-1/3 border-r">
            <ScrollArea className="h-full">
              {leads.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No leads yet. Add your first lead or import from CSV.
                </div>
              ) : (
                <div className="divide-y">
                  {leads.map(lead => (
                    <div 
                      key={lead.id}
                      className={`p-4 cursor-pointer hover:bg-muted ${selectedLead?.id === lead.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{lead.name}</h3>
                          <p className="text-sm text-muted-foreground">{lead.email}</p>
                          {lead.company && (
                            <p className="text-sm">{lead.company}</p>
                          )}
                        </div>
                        <div className="rounded-full px-2 py-1 text-xs bg-primary/10 text-primary">
                          {lead.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          
          <div className="flex-1">
            {selectedLead ? (
              <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{selectedLead.name}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteLead(selectedLead.id)}
                    >
                      Delete
                    </Button>
                    <select
                      className="px-2 py-1 rounded border"
                      value={selectedLead.status}
                      onChange={(e) => {
                        const status = e.target.value as Lead['status'];
                        handleUpdateLead({...selectedLead, status});
                      }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p>{selectedLead.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p>{selectedLead.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Company</p>
                    <p>{selectedLead.company || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Source</p>
                    <p>{selectedLead.source}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium">Notes</p>
                  <Textarea
                    value={selectedLead.notes}
                    onChange={(e) => {
                      const updatedLead = {...selectedLead, notes: e.target.value};
                      setSelectedLead(updatedLead);
                    }}
                    className="mt-1"
                    rows={5}
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      size="sm"
                      onClick={() => handleUpdateLead(selectedLead)}
                    >
                      Save Notes
                    </Button>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(selectedLead.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a lead to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsManagement;
