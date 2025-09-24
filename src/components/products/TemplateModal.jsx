import React from "react";
import Modal from "../ui/Modal";
import TemplateCard from "./TemplateCard";

const TemplateModal = ({
  isOpen,
  onClose,
  templates,
  productKey,
  productName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Templates for ${productName}`}
      size="xl"
      closeOnOverlayClick={true}
    >
      <div className="mb-4">
        <p className="text-gray-600 text-sm">
          Choose from our pre-configured templates to get started quickly, or
          create a custom configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            productKey={productKey}
            compact={false}
          />
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No templates available for this product.
          </p>
        </div>
      )}
    </Modal>
  );
};

export default TemplateModal;
